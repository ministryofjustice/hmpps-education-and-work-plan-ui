import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { AchievedQualificationDto } from 'inductionDto'
import { InductionService } from '../../../services'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import validateHighestLevelOfEducationForm from './highestLevelOfEducationFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import HighestLevelOfEducationUpdateController from './highestLevelOfEducationUpdateController'
import EducationLevelValue from '../../../enums/educationLevelValue'
import { aLongQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

jest.mock('./highestLevelOfEducationFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')

describe('highestLevelOfEducationUpdateController', () => {
  const mockedFormValidator = validateHighestLevelOfEducationForm as jest.MockedFunction<
    typeof validateHighestLevelOfEducationForm
  >
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = {
    updateInduction: jest.fn(),
  }

  const controller = new HighestLevelOfEducationUpdateController(inductionService as unknown as InductionService)

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>

    errors = []
  })

  describe('getHighestLevelOfEducationView', () => {
    it('should get the Highest Level of Education view given there is no HighestLevelOfEducationForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.highestLevelOfEducationForm = undefined

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedHighestLevelOfEducationForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: 'Back to <TODO - check what CIAG UI does here>',
        errors,
      }

      // When
      await controller.getHighestLevelOfEducationView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/prePrisonEducation/highestLevelOfEducation',
        expectedView,
      )
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Highest Level of Education view given there is a HighestLevelOfEducationForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      }
      req.session.highestLevelOfEducationForm = expectedHighestLevelOfEducationForm

      const expectedView = {
        prisonerSummary,
        form: expectedHighestLevelOfEducationForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: 'Back to <TODO - check what CIAG UI does here>',
        errors,
      }

      // When
      await controller.getHighestLevelOfEducationView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/prePrisonEducation/highestLevelOfEducation',
        expectedView,
      )
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitHighestLevelOfEducationForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidHighestLevelOfEducationForm = {
        educationLevel: '',
      }
      req.body = invalidHighestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      errors = [
        {
          href: '#educationLevel',
          text: `Select Jimmy Lightfingers's highest level of education`,
        },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/highest-level-of-education')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.highestLevelOfEducationForm).toEqual(invalidHighestLevelOfEducationForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction given form is submitted with no changes to the Highest Level of Education', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      // Long question set induction has SECONDARY_SCHOOL_TOOK_EXAMS as highest level of education
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedHighestLevelOfEducation = 'SECONDARY_SCHOOL_TOOK_EXAMS'
      const expectedQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Pottery', grade: 'C', level: QualificationLevelValue.LEVEL_4 },
      ]

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedUpdatedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update Induction containing previous qualifications given form submitted with non exam level highest level of education', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      // Long question set induction has SECONDARY_SCHOOL_TOOK_EXAMS as highest level of education, with a single qualification of Pottery, Level 4, Grade C
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'PRIMARY_SCHOOL',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedHighestLevelOfEducation = 'PRIMARY_SCHOOL'
      const expectedQualifications = [{ subject: 'Pottery', grade: 'C', level: 'LEVEL_4' }]

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedUpdatedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update Induction containing previous qualifications given form submitted with exam level highest level of education', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      // Long question set induction has SECONDARY_SCHOOL_TOOK_EXAMS as highest level of education, with a single qualification of Pottery, Level 4, Grade C
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'POSTGRADUATE_DEGREE_AT_UNIVERSITY',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedHighestLevelOfEducation = 'POSTGRADUATE_DEGREE_AT_UNIVERSITY'
      const expectedQualifications = [{ subject: 'Pottery', grade: 'C', level: 'LEVEL_4' }]

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedUpdatedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update Induction containing no previous qualifications given form submitted with non exam level highest level of education', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.previousQualifications.qualifications = [] // Induction has no previous qualifications
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'PRIMARY_SCHOOL',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedHighestLevelOfEducation = 'PRIMARY_SCHOOL'
      const expectedQualifications: Array<AchievedQualificationDto> = []

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedUpdatedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update Induction containing no previous qualifications given form submitted with exam level highest level of education', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.previousQualifications.qualifications = [] // Induction has no previous qualifications
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      const expectedUpdatedHighestLevelOfEducation = 'FURTHER_EDUCATION_COLLEGE'
      const expectedQualifications: Array<AchievedQualificationDto> = []

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousQualifications.educationLevel).toEqual(expectedUpdatedHighestLevelOfEducation)
      expect(updatedInductionDto.previousQualifications.qualifications).toEqual(expectedQualifications)

      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/qualification-level`)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'PRIMARY_SCHOOL',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedHighestLevelOfEducation = 'PRIMARY_SCHOOL'
      const expectedQualifications = [{ subject: 'Pottery', grade: 'C', level: 'LEVEL_4' }]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedUpdatedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.highestLevelOfEducationForm).toEqual(highestLevelOfEducationForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
