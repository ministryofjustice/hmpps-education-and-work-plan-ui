import moment from 'moment'
import type { Prisoner } from 'prisonRegisterApiClient'
import type {
  PrisonerSummary,
  FunctionalSkills,
  InPrisonEducationRecords,
  OtherQualifications,
  WorkAndInterests,
} from 'viewModels'
import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import OverviewController from './overviewController'
import aValidPrisonerSupportNeeds from '../../testsupport/supportNeedsTestDataBuilder'
import { CuriousService } from '../../services'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { aValidActionPlanWithOneGoal } from '../../testsupport/actionPlanTestDataBuilder'
import {
  aValidEnglishInPrisonEducation,
  aValidMathsInPrisonEducation,
} from '../../testsupport/inPrisonEducationTestDataBuilder'
import CiagInductionService from '../../services/ciagInductionService'
import aValidWorkAndInterests from '../../testsupport/workAndInterestsTestDataBuilder'

describe('overviewController', () => {
  const curiousService = {
    getPrisonerSupportNeeds: jest.fn(),
    getPrisonerFunctionalSkills: jest.fn(),
    getLearnerEducation: jest.fn(),
  }
  const educationAndWorkPlanService = {
    getActionPlan: jest.fn(),
  }
  const ciagInductionService = {
    getWorkAndInterests: jest.fn(),
    getOtherQualifications: jest.fn(),
  }

  const controller = new OverviewController(
    curiousService as unknown as CuriousService,
    educationAndWorkPlanService as unknown as EducationAndWorkPlanService,
    ciagInductionService as unknown as CiagInductionService,
  )

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

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>
  })

  describe('getOverviewView', () => {
    it('should get overview view', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username
      req.user.token = 'a-user-token'

      const expectedTab = 'overview'
      req.params.tab = expectedTab

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = { prisonNumber } as Prisoner

      const actionPlan = aValidActionPlanWithOneGoal()
      educationAndWorkPlanService.getActionPlan.mockResolvedValue(actionPlan)

      const functionalSkillsFromCurious = {
        problemRetrievingData: false,
        assessments: [],
      } as FunctionalSkills
      curiousService.getPrisonerFunctionalSkills.mockResolvedValue(functionalSkillsFromCurious)

      const expectedFunctionalSkills = {
        problemRetrievingData: false,
        assessments: [
          {
            type: 'ENGLISH',
          },
          {
            type: 'MATHS',
          },
        ],
      } as FunctionalSkills

      const inPrisonEducation: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [aValidEnglishInPrisonEducation(), aValidMathsInPrisonEducation()],
      }
      curiousService.getLearnerEducation.mockResolvedValue(inPrisonEducation)

      const expectedCompletedInPrisonEducation: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [aValidMathsInPrisonEducation()],
      }

      const expectedPrisonerSummary = { prisonNumber } as PrisonerSummary
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        prisonNumber,
        actionPlan,
        functionalSkills: expectedFunctionalSkills,
        completedInPrisonEducation: expectedCompletedInPrisonEducation,
      }

      // When
      await controller.getOverviewView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
      expect(educationAndWorkPlanService.getActionPlan).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
    })
  })

  describe('getSupportNeedsView', () => {
    it('should get support needs view', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      const expectedTab = 'support-needs'
      req.params.tab = expectedTab

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = { prisonNumber } as Prisoner

      const expectedPrisonerSummary = { prisonNumber } as PrisonerSummary
      const expectedSupportNeeds = aValidPrisonerSupportNeeds()
      curiousService.getPrisonerSupportNeeds.mockResolvedValue(expectedSupportNeeds)
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        supportNeeds: expectedSupportNeeds,
      }

      // When
      await controller.getSupportNeedsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    })
  })

  describe('getEducationAndTrainingView', () => {
    it('should get eduction and training view', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username
      req.user.token = 'a-user-token'

      const expectedTab = 'education-and-training'
      req.params.tab = expectedTab

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = { prisonNumber } as Prisoner

      const functionalSkillsFromCurious = {
        problemRetrievingData: false,
        assessments: [
          {
            assessmentDate: moment('2012-02-16').toDate(),
            grade: 'Level 1',
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            type: 'ENGLISH',
          },
        ],
      } as FunctionalSkills
      curiousService.getPrisonerFunctionalSkills.mockResolvedValue(functionalSkillsFromCurious)

      const expectedFunctionalSkills = {
        problemRetrievingData: false,
        assessments: [
          {
            assessmentDate: moment('2012-02-16').toDate(),
            grade: 'Level 1',
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            type: 'ENGLISH',
          },
          {
            type: 'MATHS',
          },
        ],
      } as FunctionalSkills

      const inPrisonEducation: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [aValidEnglishInPrisonEducation(), aValidMathsInPrisonEducation()],
      }
      curiousService.getLearnerEducation.mockResolvedValue(inPrisonEducation)

      const expectedCompletedInPrisonEducation: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [aValidMathsInPrisonEducation()],
      }

      const otherQualifications = {
        problemRetrievingData: false,
        highestEducationLevel: 'FURTHER_EDUCATION_COLLEGE',
        additionalTraining: ['CSCS_CARD'],
      } as OtherQualifications
      ciagInductionService.getOtherQualifications.mockResolvedValue(otherQualifications)

      const expectedOtherQualifications: OtherQualifications = {
        problemRetrievingData: false,
        highestEducationLevel: 'FURTHER_EDUCATION_COLLEGE',
        additionalTraining: ['CSCS_CARD'],
      }

      const expectedPrisonerSummary = { prisonNumber } as PrisonerSummary
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        functionalSkills: expectedFunctionalSkills,
        completedInPrisonEducation: expectedCompletedInPrisonEducation,
        otherQualifications: expectedOtherQualifications,
      }

      // When
      await controller.getEducationAndTrainingView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
      expect(ciagInductionService.getOtherQualifications).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
    })
  })

  describe('getWorkAndInterestsView', () => {
    it('should get work and interests view', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username
      req.user.token = 'a-user-token'

      const expectedTab = 'work-and-interests'
      req.params.tab = expectedTab

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = { prisonNumber } as Prisoner

      const expectedWorkAndInterests: WorkAndInterests = aValidWorkAndInterests()
      ciagInductionService.getWorkAndInterests.mockResolvedValue(expectedWorkAndInterests)

      const expectedPrisonerSummary = { prisonNumber } as PrisonerSummary
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        workAndInterests: expectedWorkAndInterests,
      }

      // When
      await controller.getWorkAndInterestsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
      expect(ciagInductionService.getWorkAndInterests).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
    })
  })
})
