import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { InPrisonTrainingForm } from 'inductionForms'
import type { InPrisonTrainingInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import InPrisonTrainingCreateController from './inPrisonTrainingCreateController'
import InPrisonTrainingValue from '../../../enums/inPrisonTrainingValue'
import { User } from '../../../data/manageUsersApiClient'

describe('inPrisonTrainingCreateController', () => {
  const controller = new InPrisonTrainingCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()
  const user: User = {
    username: 'a-dps-user',
    caseLoadIds: ['BXI'],
  }

  const flash = jest.fn()
  const req = {
    session: {},
    journeyData: {},
    params: { prisonNumber, journeyId },
    body: {},
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/in-prison-training`,
    flash,
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
    req.body = {}
    req.journeyData = {}
    req.query = {}
    res.locals.invalidForm = undefined
  })

  describe('getInPrisonTrainingView', () => {
    it('should get the In Prison Training view given there is no InPrisonTraining on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

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
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Training view given there is an InPrisonTraining already on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.journeyData.inductionDto = inductionDto

      const expectedInPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: ['CATERING', 'FORKLIFT_DRIVING'],
        inPrisonTrainingOther: '',
      }
      res.locals.invalidForm = expectedInPrisonTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitInPrisonTrainingForm', () => {
    it('should update inductionDto and redirect to Who Completed Induction page given previous page was not Check Your Anwsers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.journeyData.inductionDto = inductionDto

      const inPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Fence building for beginners',
      }
      req.body = inPrisonTrainingForm

      const expectedInPrisonTrainingInterests: Array<InPrisonTrainingInterestDto> = [
        { trainingType: InPrisonTrainingValue.CATERING, trainingTypeOther: undefined },
        { trainingType: InPrisonTrainingValue.OTHER, trainingTypeOther: 'Fence building for beginners' },
      ]

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedInPrisonTrainingInterests)
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/A1234BC/create-induction/${journeyId}/who-completed-induction`,
      )
    })

    it('should update inductionDto and redirect to Check Your Answers page given previous page was Check Your Answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.journeyData.inductionDto = inductionDto

      const inPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Fence building for beginners',
      }
      req.body = inPrisonTrainingForm

      const expectedInPrisonTrainingInterests: Array<InPrisonTrainingInterestDto> = [
        { trainingType: InPrisonTrainingValue.CATERING, trainingTypeOther: undefined },
        { trainingType: InPrisonTrainingValue.OTHER, trainingTypeOther: 'Fence building for beginners' },
      ]

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedInPrisonTrainingInterests)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
    })
  })
})
