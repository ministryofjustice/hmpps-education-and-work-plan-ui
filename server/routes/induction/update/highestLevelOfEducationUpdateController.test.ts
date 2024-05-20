import createError from 'http-errors'
import { Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { AchievedQualificationDto, PreviousQualificationsDto } from 'inductionDto'
import InductionService from '../../../services/inductionService'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aLongQuestionSetInductionDto,
  aShortQuestionSetInductionDto,
} from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import HighestLevelOfEducationUpdateController from './highestLevelOfEducationUpdateController'
import EducationLevelValue from '../../../enums/educationLevelValue'
import { aLongQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('highestLevelOfEducationUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new HighestLevelOfEducationUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  let req: Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary } as SessionData,
      body: {},
      user: { token: 'some-token' } as Express.User,
      params: { prisonNumber } as Record<string, string>,
      path: `/prisoners/${prisonNumber}/induction/highest-level-of-education`,
    } as unknown as Request
  })

  describe('getHighestLevelOfEducationView', () => {
    it('should get the Highest Level of Education view given there is no HighestLevelOfEducationForm on the session', async () => {
      // Given
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
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
      }

      // When
      await controller.getHighestLevelOfEducationView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/prePrisonEducation/highestLevelOfEducation',
        expectedView,
      )
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Highest Level of Education view given long question set journey', async () => {
      // Given
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
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
      }

      // When
      await controller.getHighestLevelOfEducationView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/prePrisonEducation/highestLevelOfEducation',
        expectedView,
      )
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Highest Level of Education view given there is a pageFlowHistory already on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'YES',
      }
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/qualifications`],
        currentPageIndex: 0,
      }

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      }
      req.session.highestLevelOfEducationForm = expectedHighestLevelOfEducationForm

      const expectedView = {
        prisonerSummary,
        form: expectedHighestLevelOfEducationForm,
        backLinkUrl: '/prisoners/A1234BC/induction/qualifications',
        backLinkAriaText: `Back to Jimmy Lightfingers's qualifications`,
      }
      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/A1234BC/induction/qualifications`,
          `/prisoners/A1234BC/induction/highest-level-of-education`,
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.getHighestLevelOfEducationView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/prePrisonEducation/highestLevelOfEducation',
        expectedView,
      )
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitHighestLevelOfEducationForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidHighestLevelOfEducationForm = {
        educationLevel: '',
      }
      req.body = invalidHighestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      const expectedErrors = [
        {
          href: '#educationLevel',
          text: `Select Jimmy Lightfingers's highest level of education`,
        },
      ]

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/induction/highest-level-of-education',
        expectedErrors,
      )
      expect(req.session.highestLevelOfEducationForm).toEqual(invalidHighestLevelOfEducationForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction given form is submitted with no changes to the Highest Level of Education', async () => {
      // Given
      // Long question set induction has SECONDARY_SCHOOL_TOOK_EXAMS as highest level of education
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedHighestLevelOfEducation = 'SECONDARY_SCHOOL_TOOK_EXAMS'
      const expectedQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Pottery', grade: 'C', level: QualificationLevelValue.LEVEL_4 },
      ]

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

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
      // Long question set induction has SECONDARY_SCHOOL_TOOK_EXAMS as highest level of education, with a single qualification of Pottery, Level 4, Grade C
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'PRIMARY_SCHOOL',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedHighestLevelOfEducation = 'PRIMARY_SCHOOL'
      const expectedQualifications = [{ subject: 'Pottery', grade: 'C', level: 'LEVEL_4' }]

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

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
      // Long question set induction has SECONDARY_SCHOOL_TOOK_EXAMS as highest level of education, with a single qualification of Pottery, Level 4, Grade C
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'POSTGRADUATE_DEGREE_AT_UNIVERSITY',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedHighestLevelOfEducation = 'POSTGRADUATE_DEGREE_AT_UNIVERSITY'
      const expectedQualifications = [{ subject: 'Pottery', grade: 'C', level: 'LEVEL_4' }]

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

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
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.previousQualifications.qualifications = [] // Induction has no previous qualifications
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'PRIMARY_SCHOOL',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedHighestLevelOfEducation = 'PRIMARY_SCHOOL'
      const expectedQualifications: Array<AchievedQualificationDto> = []

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

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
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.previousQualifications.qualifications = [] // Induction has no previous qualifications
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      const expectedUpdatedHighestLevelOfEducation = 'FURTHER_EDUCATION_COLLEGE'
      const expectedQualifications: Array<AchievedQualificationDto> = []
      const expectedPageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/highest-level-of-education`],
        currentPageIndex: 0,
      }

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

      // Then
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousQualifications.educationLevel).toEqual(expectedUpdatedHighestLevelOfEducation)
      expect(updatedInductionDto.previousQualifications.qualifications).toEqual(expectedQualifications)

      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/qualification-level`)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })

    it('should update InductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.NOT_SURE,
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined
      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/induction/check-your-answers',
          '/prisoners/A1234BC/induction/highest-level-of-education',
        ],
        currentPageIndex: 1,
      }
      const expectedNextPage = '/prisoners/A1234BC/induction/check-your-answers'

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

      // Then
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
    })

    it('should update InductionDto and redirect to Additional Training given the question set is being updated and the highest level of education does not need qualifications', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.previousQualifications = {
        educationLevel: EducationLevelValue.NOT_SURE,
        qualifications: [],
      } as PreviousQualificationsDto
      req.session.inductionDto = inductionDto

      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'YES',
      }

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.PRIMARY_SCHOOL,
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      const expectedNextPage = '/prisoners/A1234BC/induction/additional-training'

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
    })

    it('should update InductionDto and redirect to Qualification Level given the question set is being updated and the highest level of education does need qualifications', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.previousQualifications = {
        educationLevel: EducationLevelValue.NOT_SURE,
        qualifications: [],
      } as PreviousQualificationsDto
      req.session.inductionDto = inductionDto

      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'YES',
      }

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      const expectedNextPage = '/prisoners/A1234BC/induction/qualification-level'

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'PRIMARY_SCHOOL',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

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
      await controller.submitHighestLevelOfEducationForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedUpdatedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(updatedInduction)
    })
  })
})
