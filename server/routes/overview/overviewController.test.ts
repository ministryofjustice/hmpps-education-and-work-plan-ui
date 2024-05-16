import createError from 'http-errors'
import moment from 'moment'
import type { FunctionalSkills, InPrisonCourseRecords, Timeline, WorkAndInterests } from 'viewModels'
import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import OverviewController from './overviewController'
import aValidPrisonerSupportNeeds from '../../testsupport/supportNeedsTestDataBuilder'
import CuriousService from '../../services/curiousService'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import InductionService from '../../services/inductionService'
import PrisonService from '../../services/prisonService'
import TimelineService from '../../services/timelineService'
import { aValidActionPlan, aValidActionPlanWithOneGoal } from '../../testsupport/actionPlanTestDataBuilder'
import {
  aValidEnglishInPrisonCourse,
  aValidMathsInPrisonCourse,
  aValidEnglishInPrisonCourseCompletedWithinLast12Months,
} from '../../testsupport/inPrisonCourseTestDataBuilder'
import aValidLongQuestionSetWorkAndInterests from '../../testsupport/workAndInterestsTestDataBuilder'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidShortQuestionSetEducationAndTraining } from '../../testsupport/educationAndTrainingTestDataBuilder'
import aValidTimeline from '../../testsupport/timelineTestDataBuilder'
import filterTimelineEvents from '../timelineResolver'

jest.mock('../timelineResolver')
jest.mock('../../services/curiousService')
jest.mock('../../services/educationAndWorkPlanService')
jest.mock('../../services/inductionService')
jest.mock('../../services/prisonService')
jest.mock('../../services/timelineService')

describe('overviewController', () => {
  const mockedTimelineResolver = filterTimelineEvents as jest.MockedFunction<typeof filterTimelineEvents>

  const curiousService = new CuriousService(null, null, null) as jest.Mocked<CuriousService>
  const educationAndWorkPlanService = new EducationAndWorkPlanService(null) as jest.Mocked<EducationAndWorkPlanService>
  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const timelineService = new TimelineService(null, null) as jest.Mocked<TimelineService>
  const prisonService = new PrisonService(null, null, null) as jest.Mocked<PrisonService>

  const controller = new OverviewController(
    curiousService,
    educationAndWorkPlanService,
    inductionService,
    timelineService,
    prisonService,
  )

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
  }
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: {} as Record<string, unknown>,
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>
    res.locals = {} as Record<string, unknown>
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

      inductionService.inductionExists.mockResolvedValue(true)

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

      const inPrisonCourses: InPrisonCourseRecords = {
        problemRetrievingData: false,
        prisonNumber,
        totalRecords: 2,
        coursesByStatus: {
          COMPLETED: [aValidMathsInPrisonCourse()],
          IN_PROGRESS: [aValidEnglishInPrisonCourse()],
          WITHDRAWN: [],
          TEMPORARILY_WITHDRAWN: [],
        },
        coursesCompletedInLast12Months: [],
      }
      res.locals.curiousInPrisonCourses = inPrisonCourses

      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        prisonNumber,
        actionPlan,
        functionalSkills: expectedFunctionalSkills,
        inPrisonCourses,
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
      expect(inductionService.inductionExists).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
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

      inductionService.inductionExists.mockResolvedValue(false)

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

      const inPrisonCourses: InPrisonCourseRecords = {
        problemRetrievingData: false,
        prisonNumber,
        totalRecords: 2,
        coursesByStatus: {
          COMPLETED: [aValidMathsInPrisonCourse()],
          IN_PROGRESS: [aValidEnglishInPrisonCourse()],
          WITHDRAWN: [],
          TEMPORARILY_WITHDRAWN: [],
        },
        coursesCompletedInLast12Months: [],
      }
      res.locals.curiousInPrisonCourses = inPrisonCourses

      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        prisonNumber,
        actionPlan,
        functionalSkills: expectedFunctionalSkills,
        inPrisonCourses,
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
      expect(inductionService.inductionExists).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
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

      inductionService.inductionExists.mockRejectedValue(createError(500, 'Service unavailable'))

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
      expect(inductionService.inductionExists).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
      expect(educationAndWorkPlanService.getActionPlan).not.toHaveBeenCalled()
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

      const prisonId = 'MDI'

      const prisonerSummary = aValidPrisonerSummary(prisonNumber)
      req.session.prisonerSummary = prisonerSummary

      const expectedSupportNeeds = aValidPrisonerSupportNeeds()
      curiousService.getPrisonerSupportNeeds.mockResolvedValue(expectedSupportNeeds)
      prisonService.getPrisonByPrisonId.mockResolvedValue({ prisonId, prisonName: 'Moorland (HMP & YOI)' })
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
      expect(prisonService.getPrisonByPrisonId).toHaveBeenCalledWith(prisonId, 'a-dps-user')
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

      const inPrisonCourses: InPrisonCourseRecords = {
        problemRetrievingData: false,
        prisonNumber,
        totalRecords: 3,
        coursesByStatus: {
          COMPLETED: [aValidMathsInPrisonCourse(), aValidEnglishInPrisonCourseCompletedWithinLast12Months()],
          IN_PROGRESS: [aValidEnglishInPrisonCourse()],
          WITHDRAWN: [],
          TEMPORARILY_WITHDRAWN: [],
        },
        coursesCompletedInLast12Months: [aValidEnglishInPrisonCourseCompletedWithinLast12Months()],
      }
      res.locals.curiousInPrisonCourses = inPrisonCourses

      const expectedEducationAndTraining = aValidShortQuestionSetEducationAndTraining()
      inductionService.getEducationAndTraining.mockResolvedValue(expectedEducationAndTraining)

      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)

      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        functionalSkills: expectedFunctionalSkills,
        inPrisonCourses,
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
      expect(inductionService.getEducationAndTraining).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
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
      inductionService.getWorkAndInterests.mockResolvedValue(expectedWorkAndInterests)

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
      expect(inductionService.getWorkAndInterests).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
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
