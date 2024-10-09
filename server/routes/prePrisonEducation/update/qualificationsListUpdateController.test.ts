import { Request, Response } from 'express'
import createError from 'http-errors'
import EducationAndWorkPlanService from '../../../services/educationAndWorkPlanService'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import QualificationsListUpdateController from './qualificationsListUpdateController'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import aValidEducationDto from '../../../testsupport/educationDtoTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import validInPrisonCourseRecords from '../../../testsupport/inPrisonCourseRecordsTestDataBuilder'
import { anUpdateAchievedQualificationDto } from '../../../testsupport/achievedQualificationDtoTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'
import aValidUpdateEducationDto from '../../../testsupport/updateEducationDtoTestDataBuilder'

jest.mock('../../../services/educationAndWorkPlanService')

describe('qualificationsListUpdateController', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const controller = new QualificationsListUpdateController(educationAndWorkPlanService)

  const prisonNumber = 'A1234BC'
  const prisonId = 'BXI'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)
  const userToken = 'a-user-token'
  const functionalSkills = validFunctionalSkills()
  const inPrisonCourses = validInPrisonCourseRecords()

  const req = {
    session: {},
    user: { token: userToken },
    body: {},
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {
      prisonerSummary,
      prisonerFunctionalSkills: functionalSkills,
      curiousInPrisonCourses: inPrisonCourses,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
  })

  describe('getQualificationsListView', () => {
    it('should get the Qualifications List view', async () => {
      // Given
      const educationDto = aValidEducationDto({ prisonNumber })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      const expectedQualifications = educationDto.qualifications

      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        qualifications: expectedQualifications,
        functionalSkills,
        inPrisonCourses,
      }

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationsList', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
    })
  })

  describe('submitQualificationsListView', () => {
    it('should update Education and call API and redirect to Education and Training page', async () => {
      // Given
      const qualifications = [anUpdateAchievedQualificationDto()]
      const educationDto = aValidEducationDto({
        prisonNumber,
        qualifications,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      req.body = {}

      const expectedUpdateEducationDto = aValidUpdateEducationDto({
        ...educationDto,
        prisonId,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        qualifications,
      })

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(educationAndWorkPlanService.updateEducation).toHaveBeenCalledWith(
        prisonNumber,
        expectedUpdateEducationDto,
        'a-user-token',
      )
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toBeUndefined()
    })

    it('should not update Education given error calling service', async () => {
      // Given
      const qualifications = [anUpdateAchievedQualificationDto()]
      const educationDto = aValidEducationDto({
        prisonNumber,
        qualifications,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      req.body = {}

      const expectedUpdateEducationDto = aValidUpdateEducationDto({
        ...educationDto,
        prisonId,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        qualifications,
      })

      educationAndWorkPlanService.updateEducation.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Education for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(educationAndWorkPlanService.updateEducation).toHaveBeenCalledWith(
        prisonNumber,
        expectedUpdateEducationDto,
        'a-user-token',
      )
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
    })

    it('should redirect to Qualification Level Page given page submitted with addQualification', async () => {
      // Given
      const qualifications = [anUpdateAchievedQualificationDto()]
      const educationDto = aValidEducationDto({ prisonNumber, qualifications })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      req.body = { addQualification: '' }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/education/qualification-level')
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
    })

    it('should redisplay Qualification Details Page given page submitted with removeQualification', async () => {
      // Given
      const qualifications = [
        anUpdateAchievedQualificationDto({ subject: 'Maths' }),
        anUpdateAchievedQualificationDto({ subject: 'English' }),
        anUpdateAchievedQualificationDto({ subject: 'French' }),
      ]
      const educationDto = aValidEducationDto({ prisonNumber, qualifications })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      req.body = { removeQualification: '1' } // qualification to remove is zero indexed

      const expectedQualifications = [
        anUpdateAchievedQualificationDto({ subject: 'Maths' }),
        anUpdateAchievedQualificationDto({ subject: 'French' }),
      ]
      const expectedEducationDto = {
        ...educationDto,
        qualifications: expectedQualifications,
      }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/education/qualifications')
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(expectedEducationDto)
    })
  })
})
