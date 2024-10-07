import { Request, Response } from 'express'
import createError from 'http-errors'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import aValidEducationDto from '../../../testsupport/educationDtoTestDataBuilder'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import validInPrisonCourseRecords from '../../../testsupport/inPrisonCourseRecordsTestDataBuilder'
import { aNewAchievedQualificationDto } from '../../../testsupport/achievedQualificationDtoTestDataBuilder'
import EducationAndWorkPlanService from '../../../services/educationAndWorkPlanService'
import aValidCreateEducationDto from '../../../testsupport/createEducationDtoTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'
import QualificationsListCreateController from './qualificationsListCreateController'

jest.mock('../../../services/educationAndWorkPlanService')

describe('qualificationsListCreateController', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const controller = new QualificationsListCreateController(educationAndWorkPlanService)

  const prisonNumber = 'A1234BC'
  const prisonId = 'BXI'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)
  const functionalSkills = validFunctionalSkills()
  const inPrisonCourses = validInPrisonCourseRecords()

  let req: Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {
      prisonerFunctionalSkills: functionalSkills,
      curiousInPrisonCourses: inPrisonCourses,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()

    req = {
      session: { prisonerSummary },
      body: {},
      user: { token: 'some-token' },
      params: { prisonNumber },
      query: {},
    } as unknown as Request
  })

  describe('getQualificationListView', () => {
    it('should get the Qualification List view', async () => {
      // Given
      const qualifications = [aNewAchievedQualificationDto()]
      const educationDto = aValidEducationDto({ prisonNumber, qualifications })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/create-education/highest-level-of-education',
        backLinkAriaText: `Back to What's the highest level of education Jimmy Lightfingers completed before entering prison?`,
        qualifications,
        functionalSkills,
        inPrisonCourses,
      }

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationsList', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
    })

    it('should redirect to Highest Level of Education page given EducationDto with no educationLevel on the prisoner context', async () => {
      // Given
      const educationDto = aValidEducationDto({ prisonNumber })
      educationDto.educationLevel = undefined
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-education/highest-level-of-education')
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
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
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

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
        'some-token',
      )
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toBeUndefined()
    })

    it('should not create Education given error calling service', async () => {
      // Given
      const qualifications = [aNewAchievedQualificationDto()]
      const educationDto = aValidEducationDto({
        prisonNumber,
        qualifications,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

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
        'some-token',
      )
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
    })

    it('should redirect to Qualification Level Page given page submitted with addQualification', async () => {
      // Given
      const qualifications = [aNewAchievedQualificationDto()]
      const educationDto = aValidEducationDto({ prisonNumber, qualifications })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      req.body = { addQualification: '' }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-education/qualification-level')
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
    })

    it('should redisplay Qualification Details Page given page submitted with removeQualification', async () => {
      // Given
      const qualifications = [
        aNewAchievedQualificationDto({ subject: 'Maths' }),
        aNewAchievedQualificationDto({ subject: 'English' }),
        aNewAchievedQualificationDto({ subject: 'French' }),
      ]
      const educationDto = aValidEducationDto({ prisonNumber, qualifications })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

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
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-education/qualifications')
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(expectedEducationDto)
    })
  })
})
