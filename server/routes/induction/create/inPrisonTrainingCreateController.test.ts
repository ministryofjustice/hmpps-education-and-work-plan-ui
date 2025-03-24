import { NextFunction, Request, Response } from 'express'
import type { InPrisonTrainingForm } from 'inductionForms'
import type { InPrisonTrainingInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import InPrisonTrainingCreateController from './inPrisonTrainingCreateController'
import InPrisonTrainingValue from '../../../enums/inPrisonTrainingValue'
import { User } from '../../../data/manageUsersApiClient'
import config from '../../../config'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

jest.mock('../../../config')

describe('inPrisonTrainingCreateController', () => {
  const controller = new InPrisonTrainingCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()
  const user: User = {
    username: 'a-dps-user',
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
    config.featureToggles.reviewsEnabled = false
  })

  describe('getInPrisonTrainingView', () => {
    it('should get the In Prison Training view given there is no InPrisonTraining on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm = undefined

      const expectedInPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [],
        inPrisonTrainingOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Training view given there is an InPrisonTraining already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const expectedInPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: ['CATERING', 'FORKLIFT_DRIVING'],
        inPrisonTrainingOther: '',
      }
      getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm = expectedInPrisonTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitInPrisonTrainingForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const invalidInPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: '',
      }
      req.body = invalidInPrisonTrainingForm
      getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm = undefined

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
      expect(getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm).toEqual(invalidInPrisonTrainingForm)
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should update inductionDto and redirect to Check Your Answers page given new induction review journey is not enabled', async () => {
      // Given
      config.featureToggles.reviewsEnabled = false

      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const inPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Fence building for beginners',
      }
      req.body = inPrisonTrainingForm
      getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm = undefined

      const expectedInPrisonTrainingInterests: Array<InPrisonTrainingInterestDto> = [
        { trainingType: InPrisonTrainingValue.CATERING, trainingTypeOther: undefined },
        { trainingType: InPrisonTrainingValue.OTHER, trainingTypeOther: 'Fence building for beginners' },
      ]

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      const updatedInduction = getPrisonerContext(req.session, prisonNumber).inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedInPrisonTrainingInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Who Completed Induction page given new induction review journey is enabled', async () => {
      // Given
      config.featureToggles.reviewsEnabled = true

      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const inPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Fence building for beginners',
      }
      req.body = inPrisonTrainingForm
      getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm = undefined

      const expectedInPrisonTrainingInterests: Array<InPrisonTrainingInterestDto> = [
        { trainingType: InPrisonTrainingValue.CATERING, trainingTypeOther: undefined },
        { trainingType: InPrisonTrainingValue.OTHER, trainingTypeOther: 'Fence building for beginners' },
      ]

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      const updatedInduction = getPrisonerContext(req.session, prisonNumber).inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedInPrisonTrainingInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/who-completed-induction')
      expect(getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Check Your Answers page given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const inPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Fence building for beginners',
      }
      req.body = inPrisonTrainingForm
      getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm = undefined

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
      const updatedInduction = getPrisonerContext(req.session, prisonNumber).inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedInPrisonTrainingInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(getPrisonerContext(req.session, prisonNumber).inPrisonTrainingForm).toBeUndefined()
    })
  })
})
