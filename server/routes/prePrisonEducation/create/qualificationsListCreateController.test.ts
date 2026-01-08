import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import createError from 'http-errors'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationDto from '../../../testsupport/educationDtoTestDataBuilder'
import validFunctionalSkills from '../../../testsupport/functionalSkillsTestDataBuilder'
import validInPrisonCourseRecords from '../../../testsupport/inPrisonCourseRecordsTestDataBuilder'
import { aNewAchievedQualificationDto } from '../../../testsupport/achievedQualificationDtoTestDataBuilder'
import EducationAndWorkPlanService from '../../../services/educationAndWorkPlanService'
import aValidCreateEducationDto from '../../../testsupport/createEducationDtoTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'
import QualificationsListCreateController from './qualificationsListCreateController'
import { Result } from '../../../utils/result/result'

jest.mock('../../../services/educationAndWorkPlanService')

describe('qualificationsListCreateController', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const controller = new QualificationsListCreateController(educationAndWorkPlanService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonId = 'BXI'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber, prisonId })
  const prisonerFunctionalSkills = Result.fulfilled(validFunctionalSkills())
  const inPrisonCourses = Result.fulfilled(validInPrisonCourseRecords())
  const prisonNamesById = Result.fulfilled({ MDI: 'Moorland (HMP & YOI)', WDI: 'Wakefield (HMP)' })

  const req = {
    params: { prisonNumber, journeyId },
    user: { username },
    journeyData: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {
      prisonerSummary,
      prisonerFunctionalSkills,
      curiousInPrisonCourses: inPrisonCourses,
      prisonNamesById,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
    req.body = {}
  })

  describe('getQualificationListView', () => {
    it('should get the Qualification List view', async () => {
      // Given
      const qualifications = [aNewAchievedQualificationDto()]
      const educationDto = aValidEducationDto({ prisonNumber, qualifications })
      req.journeyData.educationDto = educationDto

      const expectedView = {
        prisonerSummary,
        qualifications,
        prisonerFunctionalSkills,
        inPrisonCourses,
        prisonNamesById,
      }

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationsList', expectedView)
      expect(req.journeyData.educationDto).toEqual(educationDto)
    })

    it('should redirect to Highest Level of Education page given EducationDto with no educationLevel on the prisoner context', async () => {
      // Given
      const educationDto = aValidEducationDto({ prisonNumber })
      educationDto.educationLevel = undefined
      req.journeyData.educationDto = educationDto

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/A1234BC/create-education/${journeyId}/highest-level-of-education`,
      )
      expect(req.journeyData.educationDto).toEqual(educationDto)
    })
  })

  describe('submitQualificationsListView', () => {
    it('should create Education and call API and redirect to Education and Training page', async () => {
      // Given
      const qualifications = [aNewAchievedQualificationDto()]
      const educationDto = aValidEducationDto({
        prisonNumber,
        qualifications,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      })
      req.journeyData.educationDto = educationDto

      req.body = {}

      const expectedCreateEducationDto = aValidCreateEducationDto({
        prisonId,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        qualifications,
      })

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(educationAndWorkPlanService.createEducation).toHaveBeenCalledWith(
        prisonNumber,
        expectedCreateEducationDto,
        username,
      )
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(req.journeyData.educationDto).toBeUndefined()
    })

    it('should not create Education given error calling service', async () => {
      // Given
      const qualifications = [aNewAchievedQualificationDto()]
      const educationDto = aValidEducationDto({
        prisonNumber,
        qualifications,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      })
      req.journeyData.educationDto = educationDto

      req.body = {}

      const expectedCreateEducationDto = aValidCreateEducationDto({
        prisonId,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        qualifications,
      })

      educationAndWorkPlanService.createEducation.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error creating Education for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(educationAndWorkPlanService.createEducation).toHaveBeenCalledWith(
        prisonNumber,
        expectedCreateEducationDto,
        username,
      )
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.journeyData.educationDto).toEqual(educationDto)
    })

    it('should redirect to Qualification Level Page given page submitted with addQualification', async () => {
      // Given
      const qualifications = [aNewAchievedQualificationDto()]
      const educationDto = aValidEducationDto({ prisonNumber, qualifications })
      req.journeyData.educationDto = educationDto

      req.body = { addQualification: '' }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-education/${journeyId}/qualification-level`)
      expect(req.journeyData.educationDto).toEqual(educationDto)
    })

    it('should redisplay Qualification Details Page given page submitted with removeQualification', async () => {
      // Given
      const qualifications = [
        aNewAchievedQualificationDto({ subject: 'Maths' }),
        aNewAchievedQualificationDto({ subject: 'English' }),
        aNewAchievedQualificationDto({ subject: 'French' }),
      ]
      const educationDto = aValidEducationDto({ prisonNumber, qualifications })
      req.journeyData.educationDto = educationDto

      req.body = { removeQualification: '1' } // qualification to remove is zero indexed

      const expectedQualifications = [
        aNewAchievedQualificationDto({ subject: 'Maths' }),
        aNewAchievedQualificationDto({ subject: 'French' }),
      ]
      const expectedEducationDto = {
        ...educationDto,
        qualifications: expectedQualifications,
      }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-education/${journeyId}/qualifications`)
      expect(req.journeyData.educationDto).toEqual(expectedEducationDto)
    })
  })
})
