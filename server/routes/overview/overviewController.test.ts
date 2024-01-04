import createError from 'http-errors'
import moment from 'moment'
import type { FunctionalSkills, InPrisonEducationRecords, Timeline, WorkAndInterests } from 'viewModels'
import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import OverviewController from './overviewController'
import aValidPrisonerSupportNeeds from '../../testsupport/supportNeedsTestDataBuilder'
import { CuriousService } from '../../services'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { aValidActionPlan, aValidActionPlanWithOneGoal } from '../../testsupport/actionPlanTestDataBuilder'
import {
  aValidEnglishInPrisonEducation,
  aValidMathsInPrisonEducation,
} from '../../testsupport/inPrisonEducationTestDataBuilder'
import CiagInductionService from '../../services/ciagInductionService'
import aValidLongQuestionSetWorkAndInterests from '../../testsupport/workAndInterestsTestDataBuilder'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidShortQuestionSetEducationAndTraining } from '../../testsupport/educationAndTrainingTestDataBuilder'
import TimelineService from '../../services/timelineService'
import aValidTimeline from '../../testsupport/timelineTestDataBuilder'
import filterTimelineEvents from '../timelineResolver'

jest.mock('../timelineResolver')

describe('overviewController', () => {
  const mockedTimelineResolver = filterTimelineEvents as jest.MockedFunction<typeof filterTimelineEvents>

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
    getEducationAndTraining: jest.fn(),
    ciagInductionExists: jest.fn(),
  }
  const timelineService = {
    getTimeline: jest.fn(),
  }

  const controller = new OverviewController(
    curiousService as unknown as CuriousService,
    educationAndWorkPlanService as unknown as EducationAndWorkPlanService,
    ciagInductionService as unknown as CiagInductionService,
    timelineService as unknown as TimelineService,
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

  // TODO - remove these tests after private beta go-live, once we have switched over to use the PLP Prisoner List and Overview screens rather than the CIAG ones
  describe('getPrivateBetaOverviewView', () => {
    it('should get overview view', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username
      req.user.token = 'a-user-token'

      const expectedTab = 'overview'
      req.params.tab = expectedTab

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = aValidPrisonerSummary(prisonNumber)

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

      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        prisonNumber,
        actionPlan,
        functionalSkills: expectedFunctionalSkills,
        completedInPrisonEducation: expectedCompletedInPrisonEducation,
        isPostInduction: true,
      }

      // When
      await controller.getPrivateBetaOverviewView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
      expect(educationAndWorkPlanService.getActionPlan).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
      expect(req.session.newGoal).toBeUndefined()
      expect(req.session.newGoals).toBeUndefined()
    })
  })

  describe('getOverviewView', () => {
    it('should get overview view given CIAG Induction and PLP Action Plan both exist', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username
      req.user.token = 'a-user-token'

      const expectedTab = 'overview'
      req.params.tab = expectedTab

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = aValidPrisonerSummary(prisonNumber)

      ciagInductionService.ciagInductionExists.mockResolvedValue(true)

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

      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        prisonNumber,
        actionPlan,
        functionalSkills: expectedFunctionalSkills,
        completedInPrisonEducation: expectedCompletedInPrisonEducation,
        isPostInduction: true,
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
      expect(ciagInductionService.ciagInductionExists).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
      expect(req.session.newGoal).toBeUndefined()
      expect(req.session.newGoals).toBeUndefined()
    })

    it('should get overview view given CIAG Induction does not exist', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username
      req.user.token = 'a-user-token'

      const expectedTab = 'overview'
      req.params.tab = expectedTab

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = aValidPrisonerSummary(prisonNumber)

      ciagInductionService.ciagInductionExists.mockResolvedValue(false)

      const actionPlan = aValidActionPlan({ goals: [] })
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

      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        prisonNumber,
        actionPlan,
        functionalSkills: expectedFunctionalSkills,
        completedInPrisonEducation: expectedCompletedInPrisonEducation,
        isPostInduction: false,
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
      expect(ciagInductionService.ciagInductionExists).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
      expect(req.session.newGoal).toBeUndefined()
      expect(req.session.newGoals).toBeUndefined()
    })

    it('should not get overview view given CIAG Induction throws an error', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username
      req.user.token = 'a-user-token'

      const expectedTab = 'overview'
      req.params.tab = expectedTab

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = aValidPrisonerSummary(prisonNumber)

      ciagInductionService.ciagInductionExists.mockRejectedValue(createError(500, 'Service unavailable'))

      const expectedError = createError(
        500,
        `Error checking whether a CIAG Induction exists for prisoner ${prisonNumber}`,
      )

      // When
      await controller.getOverviewView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(res.render).not.toHaveBeenCalled()
      expect(ciagInductionService.ciagInductionExists).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
      expect(educationAndWorkPlanService.getActionPlan).not.toHaveBeenCalled()
      expect(curiousService.getLearnerEducation).not.toHaveBeenCalled()
      expect(curiousService.getPrisonerFunctionalSkills).not.toHaveBeenCalled()
      expect(req.session.newGoal).toBeUndefined()
      expect(req.session.newGoals).toBeUndefined()
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

      const prisonerSummary = aValidPrisonerSummary(prisonNumber)
      req.session.prisonerSummary = prisonerSummary

      const expectedSupportNeeds = aValidPrisonerSupportNeeds()
      curiousService.getPrisonerSupportNeeds.mockResolvedValue(expectedSupportNeeds)
      const expectedView = {
        prisonerSummary,
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

      req.session.prisonerSummary = aValidPrisonerSummary(prisonNumber)

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

      const expectedEducationAndTraining = aValidShortQuestionSetEducationAndTraining()
      ciagInductionService.getEducationAndTraining.mockResolvedValue(expectedEducationAndTraining)

      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        functionalSkills: expectedFunctionalSkills,
        completedInPrisonEducation: expectedCompletedInPrisonEducation,
        educationAndTraining: expectedEducationAndTraining,
      }

      // When
      await controller.getEducationAndTrainingView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
      expect(ciagInductionService.getEducationAndTraining).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
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

      const prisonerSummary = aValidPrisonerSummary(prisonNumber)
      req.session.prisonerSummary = prisonerSummary

      const expectedWorkAndInterests: WorkAndInterests = aValidLongQuestionSetWorkAndInterests()
      ciagInductionService.getWorkAndInterests.mockResolvedValue(expectedWorkAndInterests)

      const expectedView = {
        prisonerSummary,
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

  describe('getTimelineView', () => {
    it('should get timeline view', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username
      req.user.token = 'a-user-token'

      const expectedTab = 'timeline'
      req.params.tab = expectedTab

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary(prisonNumber)
      req.session.prisonerSummary = prisonerSummary

      const expectedTimeline: Timeline = aValidTimeline()
      timelineService.getTimeline.mockResolvedValue(expectedTimeline)
      mockedTimelineResolver.mockReturnValue(expectedTimeline)

      const expectedView = {
        prisonerSummary,
        tab: expectedTab,
        timeline: expectedTimeline,
      }

      // When
      await controller.getTimelineView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
      expect(timelineService.getTimeline).toHaveBeenCalledWith(prisonNumber, 'a-user-token', 'a-dps-user')
    })
  })
})
