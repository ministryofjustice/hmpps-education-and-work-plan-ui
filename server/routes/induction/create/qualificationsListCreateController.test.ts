import { Request, Response } from 'express'
import type { AchievedQualificationDto, InductionDto } from 'inductionDto'
import QualificationsListCreateController from './qualificationsListCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import EducationLevelValue from '../../../enums/educationLevelValue'
import validInPrisonCourseRecords from '../../../testsupport/inPrisonCourseRecordsTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

describe('qualificationsListCreateController', () => {
  const controller = new QualificationsListCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()
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
      body: {},
      session: { prisonerSummary },
      params: { prisonNumber },
      path: `/prisoners/${prisonNumber}/create-induction/qualifications`,
    } as unknown as Request
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
        backLinkUrl: '/prisoners/A1234BC/create-induction/work-interest-roles',
        backLinkAriaText: 'Back to Is Jimmy Lightfingers interested in any particular jobs?',
        qualifications: expectedQualifications,
        functionalSkills,
        inPrisonCourses,
      }

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/prePrisonEducation/qualificationsList', expectedView)
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
        backLinkUrl: '/prisoners/A1234BC/create-induction/want-to-add-qualifications',
        backLinkAriaText:
          'Back to Does Jimmy Lightfingers have any other educational qualifications they want to be recorded?',
        qualifications: expectedQualifications,
        functionalSkills,
        inPrisonCourses,
      }

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/prePrisonEducation/qualificationsList', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Qualifications List view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/qualifications',
        ],
        currentPageIndex: 1,
      }

      const expectedQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Pottery', grade: 'C', level: QualificationLevelValue.LEVEL_4 },
      ]

      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
        qualifications: expectedQualifications,
        functionalSkills,
        inPrisonCourses,
      }

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/prePrisonEducation/qualificationsList', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
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
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/qualifications')
    })

    it('should redirect to Qualification Level Page given page submitted with addQualification', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      req.body = { addQualification: '' }

      const expectedPageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/create-induction/qualifications`],
        currentPageIndex: 0,
      }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/qualification-level')
    })

    it('should redirect to Highest Level of Education Page given page submitted with no qualifications on the Induction', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined // No qualifications on the Induction
      req.session.inductionDto = inductionDto

      const expectedPageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/create-induction/qualifications`],
        currentPageIndex: 0,
      }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/highest-level-of-education')
    })

    it('should redirect to Additional Training Page given user has not come from Check Your Answers and page submitted with qualifications on the Induction', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto
      /* The Induction has Secondary School with Exams as the highest level of education, and the following qualification:
           - Level 4 Pottery, Grade C
       */

      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/create-induction/qualifications`],
        currentPageIndex: 0,
      }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/additional-training')
      expect(req.session.pageFlowHistory).toBeUndefined()
    })

    it('should redirect to Check Your Answers given user has come from Check Your Answers and page submitted with qualifications on the Induction', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto
      /* The Induction has Secondary School with Exams as the highest level of education, and the following qualification:
           - Level 4 Pottery, Grade C
       */

      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/create-induction/check-your-answers`],
        currentPageIndex: 0,
      }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.pageFlowHistory).toBeUndefined()
    })
  })
})
