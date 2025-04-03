import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { AchievedQualificationDto } from 'dto'
import type { InductionDto } from 'inductionDto'
import QualificationsListCreateController from './qualificationsListCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'
import validInPrisonCourseRecords from '../../../testsupport/inPrisonCourseRecordsTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

describe('qualificationsListCreateController', () => {
  const controller = new QualificationsListCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()
  const functionalSkills = validFunctionalSkills()
  const inPrisonCourses = validInPrisonCourseRecords()

  const req = {
    session: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualifications`,
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
    req.session.pageFlowHistory = undefined
    req.body = {}
  })

  describe('getQualificationsListView', () => {
    it('should get the Qualifications List view given the Induction has Hoping To Get Work as Yes', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hopingToGetWork: HopingToGetWorkValue.YES })
      inductionDto.previousQualifications.qualifications = []
      req.session.inductionDto = inductionDto

      const expectedQualifications: Array<AchievedQualificationDto> = []

      const expectedView = {
        prisonerSummary,
        qualifications: expectedQualifications,
        functionalSkills,
        inPrisonCourses,
      }

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationsList', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Qualifications List view given the Induction has Hoping To Get Work as No', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hopingToGetWork: HopingToGetWorkValue.NO })
      inductionDto.previousQualifications.qualifications = []
      req.session.inductionDto = inductionDto

      const expectedQualifications: Array<AchievedQualificationDto> = []

      const expectedView = {
        prisonerSummary,
        qualifications: expectedQualifications,
        functionalSkills,
        inPrisonCourses,
      }

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationsList', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitQualificationsListView', () => {
    it('should update Induction and redisplay Qualification List Page given page submitted with removeQualification', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto
      /* The Induction has Secondary School with Exams as the highest level of education, and the following qualification:
           - Level 4 Pottery, Grade C
       */

      req.body = { removeQualification: '0' } // We expect to delete Pottery, as it is the first qualification (zero indexed)

      const expectedHighestLevelOfEducation: EducationLevelValue = EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS
      const expectedQualifications: Array<AchievedQualificationDto> = []

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      const updatedInduction: InductionDto = req.session.inductionDto
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/qualifications`)
    })

    it('should redirect to Qualification Level Page given page submitted with addQualification', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      req.body = { addQualification: '' }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/qualification-level`)
    })

    it('should redirect to Highest Level of Education Page given page submitted with no qualifications on the Induction', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined // No qualifications on the Induction
      req.session.inductionDto = inductionDto

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/A1234BC/create-induction/${journeyId}/highest-level-of-education`,
      )
    })

    it('should redirect to Additional Training Page given user has not come from Check Your Answers and page submitted with qualifications on the Induction', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto
      /* The Induction has Secondary School with Exams as the highest level of education, and the following qualification:
           - Level 4 Pottery, Grade C
       */

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/additional-training`)
    })

    it('should redirect to Check Your Answers given user has come from Check Your Answers and page submitted with qualifications on the Induction', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto
      /* The Induction has Secondary School with Exams as the highest level of education, and the following qualification:
           - Level 4 Pottery, Grade C
       */

      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`],
        currentPageIndex: 0,
      }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
      expect(req.session.pageFlowHistory).toBeUndefined()
    })
  })
})
