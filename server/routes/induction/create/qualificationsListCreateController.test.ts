import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { AchievedQualificationDto, InductionDto } from 'inductionDto'
import QualificationsListCreateController from './qualificationsListCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import EducationLevelValue from '../../../enums/educationLevelValue'

describe('qualificationsListCreateController', () => {
  const controller = new QualificationsListCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = { prisonerSummary } as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/create-induction/qualifications`
  })

  describe('getQualificationsListView', () => {
    it('should get the Qualifications List view', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      const functionalSkills = validFunctionalSkills()
      req.session.prisonerFunctionalSkills = functionalSkills

      const expectedQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Pottery', grade: 'C', level: QualificationLevelValue.LEVEL_4 },
      ]

      const expectedFunctionalSkills = functionalSkills

      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/create-induction/hoping-to-work-on-release',
        backLinkAriaText: `Back to Is Jimmy Lightfingers hoping to get work when they're released?`,
        qualifications: expectedQualifications,
        functionalSkills: expectedFunctionalSkills,
      }

      // When
      await controller.getQualificationsListView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/prePrisonEducation/qualificationsList', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitQualificationsListView', () => {
    it('should update Induction and redisplay Qualification List Page given page submitted with removeQualification', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      /* The long question set induction has Secondary School with Exams as the highest level of education, and the following qualification:
           - Level 4 Pottery, Grade C
       */

      req.body = { removeQualification: '0' } // We expect to delete Pottery, as it is the first qualification (zero indexed)

      const expectedHighestLevelOfEducation: EducationLevelValue = EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS
      const expectedQualifications: Array<AchievedQualificationDto> = []

      // When
      await controller.submitQualificationsListView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInduction: InductionDto = req.session.inductionDto
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/qualifications')
    })

    it('should redirect to Qualification Level Page given page submitted with addQualification', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      req.body = { addQualification: '' }

      const expectedPageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/create-induction/qualifications`],
        currentPageIndex: 0,
      }

      // When
      await controller.submitQualificationsListView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/qualification-level')
    })

    it('should redirect to Highest Level of Education Page given page submitted with no qualifications on the Induction', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.previousQualifications = undefined // No qualifications on the Induction
      req.session.inductionDto = inductionDto

      const expectedPageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/create-induction/qualifications`],
        currentPageIndex: 0,
      }

      // When
      await controller.submitQualificationsListView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/highest-level-of-education')
    })

    it('should redirect to Additional Training Page given page submitted with no qualifications on the Induction', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedPageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/create-induction/qualifications`],
        currentPageIndex: 0,
      }

      // When
      await controller.submitQualificationsListView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/additional-training')
    })
  })
})
