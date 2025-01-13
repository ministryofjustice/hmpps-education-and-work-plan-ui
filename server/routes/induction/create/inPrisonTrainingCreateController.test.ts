import { NextFunction, Request, Response } from 'express'
import type { InPrisonTrainingForm } from 'inductionForms'
import type { InPrisonTrainingInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import InPrisonTrainingCreateController from './inPrisonTrainingCreateController'
import InPrisonTrainingValue from '../../../enums/inPrisonTrainingValue'
import { User } from '../../../data/manageUsersApiClient'

const reviewJourneyEnabledForPrison = jest.fn()
jest.mock('../../../config', () => ({
  featureToggles: {
    reviewJourneyEnabledForPrison: (prisonId: string) => reviewJourneyEnabledForPrison(prisonId),
  },
}))

describe('inPrisonTrainingCreateController', () => {
  const controller = new InPrisonTrainingCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()
  const user: User = {
    username: 'a-dps-user',
    activeCaseLoadId: 'BXI',
    caseLoadIds: ['BXI'],
  }

  const req = {
    session: {},
    params: { prisonNumber },
    body: {},
    path: `/prisoners/${prisonNumber}/create-induction/in-prison-training`,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary, user },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session.pageFlowHistory = undefined
    req.body = {}
    reviewJourneyEnabledForPrison.mockReturnValue(false)
  })

  describe('getInPrisonTrainingView', () => {
    it('should get the In Prison Training view given there is no InPrisonTraining on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.session.inductionDto = inductionDto
      req.session.inPrisonTrainingForm = undefined

      const expectedInPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [],
        inPrisonTrainingOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/in-prison-work',
        backLinkAriaText: 'Back to What type of work would Jimmy Lightfingers like to do in prison?',
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Training view given there is an InPrisonTraining already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.session.inductionDto = inductionDto

      const expectedInPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: ['CATERING', 'FORKLIFT_DRIVING'],
        inPrisonTrainingOther: '',
      }
      req.session.inPrisonTrainingForm = expectedInPrisonTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/in-prison-work',
        backLinkAriaText: 'Back to What type of work would Jimmy Lightfingers like to do in prison?',
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Training view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/in-prison-training',
        ],
        currentPageIndex: 1,
      }

      const expectedInPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: ['CATERING', 'FORKLIFT_DRIVING'],
        inPrisonTrainingOther: '',
      }
      req.session.inPrisonTrainingForm = expectedInPrisonTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitInPrisonTrainingForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.session.inductionDto = inductionDto

      const invalidInPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: '',
      }
      req.body = invalidInPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined

      const expectedErrors = [
        {
          href: '#inPrisonTrainingOther',
          text: 'Enter the type of type of training Jimmy Lightfingers would like to do in prison',
        },
      ]

      // When
      await controller.submitInPrisonTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/in-prison-training',
        expectedErrors,
      )
      expect(req.session.inPrisonTrainingForm).toEqual(invalidInPrisonTrainingForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update inductionDto and redirect to Check Your Answers page given users active caseloadID is not enabled for new induction journey', async () => {
      // Given
      reviewJourneyEnabledForPrison.mockReturnValue(false)

      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.session.inductionDto = inductionDto

      const inPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Fence building for beginners',
      }
      req.body = inPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined

      const expectedInPrisonTrainingInterests: Array<InPrisonTrainingInterestDto> = [
        { trainingType: InPrisonTrainingValue.CATERING, trainingTypeOther: undefined },
        { trainingType: InPrisonTrainingValue.OTHER, trainingTypeOther: 'Fence building for beginners' },
      ]

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedInPrisonTrainingInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(reviewJourneyEnabledForPrison).toHaveBeenCalledWith(user.activeCaseLoadId)
    })

    it('should update inductionDto and redirect to Who Completed Induction page given users active caseloadID is enabled for new induction journey', async () => {
      // Given
      reviewJourneyEnabledForPrison.mockReturnValue(true)

      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.session.inductionDto = inductionDto

      const inPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Fence building for beginners',
      }
      req.body = inPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined

      const expectedInPrisonTrainingInterests: Array<InPrisonTrainingInterestDto> = [
        { trainingType: InPrisonTrainingValue.CATERING, trainingTypeOther: undefined },
        { trainingType: InPrisonTrainingValue.OTHER, trainingTypeOther: 'Fence building for beginners' },
      ]

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedInPrisonTrainingInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/who-completed-induction')
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(reviewJourneyEnabledForPrison).toHaveBeenCalledWith(user.activeCaseLoadId)
    })

    it('should update inductionDto and redirect to Check Your Answers page given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.session.inductionDto = inductionDto

      const inPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Fence building for beginners',
      }
      req.body = inPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined

      const expectedInPrisonTrainingInterests: Array<InPrisonTrainingInterestDto> = [
        { trainingType: InPrisonTrainingValue.CATERING, trainingTypeOther: undefined },
        { trainingType: InPrisonTrainingValue.OTHER, trainingTypeOther: 'Fence building for beginners' },
      ]

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/in-prison-training',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedInPrisonTrainingInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(reviewJourneyEnabledForPrison).not.toHaveBeenCalled()
    })
  })
})
