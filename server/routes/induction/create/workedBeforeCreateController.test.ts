import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { WorkedBeforeForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import WorkedBeforeCreateController from './workedBeforeCreateController'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

describe('workedBeforeCreateController', () => {
  const controller = new WorkedBeforeCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/has-worked-before`,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {}
    req.query = {}
    res.locals.invalidForm = undefined
  })

  describe('getWorkedBeforeView', () => {
    it('should get the WorkedBefore view given there is no WorkedBeforeForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

      const expectedWorkedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
      }

      // When
      await controller.getWorkedBeforeView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the WorkedBefore view given there is an WorkedBeforeForm already on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.journeyData.inductionDto = inductionDto

      const expectedWorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NO,
      }
      res.locals.invalidForm = expectedWorkedBeforeForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
      }

      // When
      await controller.getWorkedBeforeView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitWorkedBeforeForm', () => {
    it('should update InductionDto and display Previous Work Experience page given form is submitted with worked before YES and previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.journeyData.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.YES,
        hasWorkedBeforeNotRelevantReason: undefined,
      }
      req.body = workedBeforeForm

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('previous-work-experience')
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('YES')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toBeUndefined()
      expect(updatedInduction.previousWorkExperiences.needToCompleteJourneyFromCheckYourAnswers).toEqual(false)
    })

    it('should update InductionDto and display Skills page given form is submitted with worked before NO and previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.journeyData.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NO,
        hasWorkedBeforeNotRelevantReason: undefined,
      }
      req.body = workedBeforeForm

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('skills')
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('NO')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toBeUndefined()
      expect(updatedInduction.previousWorkExperiences.needToCompleteJourneyFromCheckYourAnswers).toEqual(false)
    })

    it('should update InductionDto and display Skills page given form is submitted with worked before NOT_RELEVANT and previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.journeyData.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NOT_RELEVANT,
        hasWorkedBeforeNotRelevantReason:
          'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      }
      req.body = workedBeforeForm

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('skills')
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('NOT_RELEVANT')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toEqual(
        'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      )
      expect(updatedInduction.previousWorkExperiences.needToCompleteJourneyFromCheckYourAnswers).toEqual(false)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers and worked before is changed to NO', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      req.journeyData.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NO,
        hasWorkedBeforeNotRelevantReason: undefined,
      }
      req.body = workedBeforeForm

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('NO')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toBeUndefined()
      expect(res.redirect).toHaveBeenCalledWith('check-your-answers')
      expect(updatedInduction.previousWorkExperiences.needToCompleteJourneyFromCheckYourAnswers).toEqual(true)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers and worked before is changed to NOT_RELEVANT', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      req.journeyData.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NOT_RELEVANT,
        hasWorkedBeforeNotRelevantReason:
          'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      }
      req.body = workedBeforeForm

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('NOT_RELEVANT')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toEqual(
        'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      )
      expect(res.redirect).toHaveBeenCalledWith('check-your-answers')
      expect(updatedInduction.previousWorkExperiences.needToCompleteJourneyFromCheckYourAnswers).toEqual(true)
    })

    it('should update inductionDto and redirect to Previous Work Experience given previous page was Check Your Answers and worked before is changed to YES', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences.hasWorkedBefore = 'NOT_RELEVANT'
      inductionDto.previousWorkExperiences.hasWorkedBeforeNotRelevantReason =
        'Chris feels his previous work experience is not relevant as he is not planning on working upon release.'
      inductionDto.previousWorkExperiences.experiences = []
      req.journeyData.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.YES,
        hasWorkedBeforeNotRelevantReason: undefined,
      }
      req.body = workedBeforeForm

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('YES')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toBeUndefined()
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual([])
      expect(res.redirect).toHaveBeenCalledWith('previous-work-experience')
      expect(updatedInduction.previousWorkExperiences.needToCompleteJourneyFromCheckYourAnswers).toEqual(true)
    })
  })
})
