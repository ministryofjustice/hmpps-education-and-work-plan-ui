import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import type { AdditionalTrainingForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aLongQuestionSetInductionDto,
  aShortQuestionSetInductionDto,
} from '../../../testsupport/inductionDtoTestDataBuilder'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'
import AdditionalTrainingCreateController from './additionalTrainingCreateController'

describe('additionalTrainingCreateController', () => {
  const controller = new AdditionalTrainingCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const noErrors: Array<Record<string, string>> = []

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = { prisonerSummary } as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/create-induction/additional-training`
  })

  describe('getAdditionalTrainingView', () => {
    it('should get Additional Training view given there is no AdditionalTrainingForm on the session', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.previousTraining = undefined
      req.session.inductionDto = inductionDto
      req.session.additionalTrainingForm = undefined
      const expectedAdditionalTrainingForm: AdditionalTrainingForm = {
        additionalTraining: [],
        additionalTrainingOther: undefined,
      }

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/qualifications`,
          `/prisoners/${prisonNumber}/create-induction/additional-training`,
        ],
        currentPageIndex: 1,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedAdditionalTrainingForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/qualifications',
        backLinkAriaText: `Back to Jimmy Lightfingers's qualifications`,
        errors: noErrors,
      }

      // When
      await controller.getAdditionalTrainingView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/additionalTraining/index', expectedView)
      expect(req.session.additionalTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Additional Training view given there is an AdditionalTrainingForm already on the session', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.previousTraining = undefined
      req.session.inductionDto = inductionDto

      const expectedAdditionalTrainingForm: AdditionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Beginners cookery for IT professionals',
      }
      req.session.additionalTrainingForm = expectedAdditionalTrainingForm

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/qualifications`,
          `/prisoners/${prisonNumber}/create-induction/additional-training`,
        ],
        currentPageIndex: 1,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedAdditionalTrainingForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/qualifications',
        backLinkAriaText: `Back to Jimmy Lightfingers's qualifications`,
        errors: noErrors,
      }

      // When
      await controller.getAdditionalTrainingView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/additionalTraining/index', expectedView)
      expect(req.session.additionalTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitAdditionalTrainingForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.previousTraining = undefined
      req.session.inductionDto = inductionDto

      const invalidAdditionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.OTHER],
        additionalTrainingOther: '',
      }
      req.body = invalidAdditionalTrainingForm
      req.session.additionalTrainingForm = undefined

      const expectedErrors = [
        {
          href: '#additionalTrainingOther',
          text: 'Enter the type of training or vocational qualification Jimmy Lightfingers has',
        },
      ]

      // When
      await controller.submitAdditionalTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/additional-training')
      expect(req.flash).toHaveBeenCalledWith('errors', expectedErrors)
      expect(req.session.additionalTrainingForm).toEqual(invalidAdditionalTrainingForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update InductionDto and redirect to Has Worked Before view given long question set journey', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.previousTraining = undefined
      req.session.inductionDto = inductionDto

      const additionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.HGV_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Italian cookery for IT professionals',
      }
      req.body = additionalTrainingForm
      req.session.additionalTrainingForm = undefined

      const expectedUpdatedAdditionalTraining = ['HGV_LICENCE', 'OTHER']
      const expectedUpdatedAdditionalTrainingOther = 'Italian cookery for IT professionals'

      const expectedNextPage = '/prisoners/A1234BC/create-induction/has-worked-before'

      // When
      await controller.submitAdditionalTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousTraining.trainingTypes).toEqual(expectedUpdatedAdditionalTraining)
      expect(updatedInductionDto.previousTraining.trainingTypeOther).toEqual(expectedUpdatedAdditionalTrainingOther)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.additionalTrainingForm).toBeUndefined()
    })

    it('should update InductionDto and redirect to In Prison Work view given shprt question set journey', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.previousTraining = undefined
      req.session.inductionDto = inductionDto

      const additionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.HGV_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Italian cookery for IT professionals',
      }
      req.body = additionalTrainingForm
      req.session.additionalTrainingForm = undefined

      const expectedUpdatedAdditionalTraining = ['HGV_LICENCE', 'OTHER']
      const expectedUpdatedAdditionalTrainingOther = 'Italian cookery for IT professionals'

      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'YES' }
      const expectedNextPage = '/prisoners/A1234BC/create-induction/in-prison-work'

      // When
      await controller.submitAdditionalTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousTraining.trainingTypes).toEqual(expectedUpdatedAdditionalTraining)
      expect(updatedInductionDto.previousTraining.trainingTypeOther).toEqual(expectedUpdatedAdditionalTrainingOther)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.additionalTrainingForm).toBeUndefined()
    })

    it('should update InductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const additionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.HGV_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Italian cookery for IT professionals',
      }
      req.body = additionalTrainingForm
      req.session.additionalTrainingForm = undefined

      const expectedUpdatedAdditionalTraining = ['HGV_LICENCE', 'OTHER']
      const expectedUpdatedAdditionalTrainingOther = 'Italian cookery for IT professionals'

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/additional-training',
        ],
        currentPageIndex: 1,
      }
      const expectedNextPage = '/prisoners/A1234BC/create-induction/check-your-answers'

      // When
      await controller.submitAdditionalTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousTraining.trainingTypes).toEqual(expectedUpdatedAdditionalTraining)
      expect(updatedInductionDto.previousTraining.trainingTypeOther).toEqual(expectedUpdatedAdditionalTrainingOther)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.additionalTrainingForm).toBeUndefined()
    })
  })
})
