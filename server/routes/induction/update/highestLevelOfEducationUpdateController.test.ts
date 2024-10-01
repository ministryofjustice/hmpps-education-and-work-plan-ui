import createError from 'http-errors'
import { Request, Response } from 'express'
import type { AchievedQualificationDto } from 'dto'
import InductionService from '../../../services/inductionService'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import HighestLevelOfEducationUpdateController from './highestLevelOfEducationUpdateController'
import EducationLevelValue from '../../../enums/educationLevelValue'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('highestLevelOfEducationUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new HighestLevelOfEducationUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    user: { token: 'some-token' },
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/induction/highest-level-of-education`,
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
    req.session.pageFlowHistory = undefined
    req.body = {}
  })

  describe('getHighestLevelOfEducationView', () => {
    it('should get the Highest Level of Education view given there is no HighestLevelOfEducationForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
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
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/highestLevelOfEducation', expectedView)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Highest Level of Education view given there is a HighestLevelOfEducationForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
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
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/highestLevelOfEducation', expectedView)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Highest Level of Education view given there is a pageFlowHistory already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

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
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/highestLevelOfEducation', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitHighestLevelOfEducationForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
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
      // Induction has SECONDARY_SCHOOL_TOOK_EXAMS as highest level of education
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      const updateInductionDto = aValidUpdateInductionRequest()
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

    it('should update Induction given form is submitted with change to Highest Level of Education', async () => {
      // Given
      // Induction has SECONDARY_SCHOOL_TOOK_EXAMS as highest level of education, with a single qualification of Pottery, Level 4, Grade C
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'POSTGRADUATE_DEGREE_AT_UNIVERSITY',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      const updateInductionDto = aValidUpdateInductionRequest()
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

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: 'PRIMARY_SCHOOL',
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

      const updateInductionDto = aValidUpdateInductionRequest()
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
