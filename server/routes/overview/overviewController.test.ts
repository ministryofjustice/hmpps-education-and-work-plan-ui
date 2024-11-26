import { Request, Response } from 'express'
import type { Assessment, FunctionalSkills, InPrisonCourse, InPrisonCourseRecords, PrisonerGoals } from 'viewModels'
import { parseISO } from 'date-fns'
import { aValidEnglishInPrisonCourse, aValidMathsInPrisonCourse } from '../../testsupport/inPrisonCourseTestDataBuilder'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidGoalResponse } from '../../testsupport/actionPlanResponseTestDataBuilder'
import GoalStatusValue from '../../enums/goalStatusValue'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import OverviewController from './overviewController'
import aValidActionPlanReviews from '../../testsupport/actionPlanReviewsTestDataBuilder'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'

jest.mock('../../services/educationAndWorkPlanService')

describe('overviewController', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const controller = new OverviewController(educationAndWorkPlanService)

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

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

  const functionalSkillsFromCurious = {
    problemRetrievingData: false,
    assessments: [{ type: 'ENGLISH' }, { type: 'MATHS' }],
  } as FunctionalSkills

  const req = {
    session: {},
    user: { username },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    res.locals = {
      prisonerSummary,
      curiousInPrisonCourses: inPrisonCourses,
      prisonerFunctionalSkills: functionalSkillsFromCurious,
    }
    jest.resetAllMocks()
  })

  it('should get overview view given Induction, Goals, and Action Plan Reviews all exist', async () => {
    // Given
    const inProgressGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ACTIVE,
      updatedAt: new Date('2023-09-23T13:42:01.401Z'),
    }
    const archivedGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ARCHIVED,
      updatedAt: new Date('2023-08-23T13:42:01.401Z'),
    }
    const completedGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.COMPLETED,
      updatedAt: new Date('2023-07-23T13:42:01.401Z'),
    }

    educationAndWorkPlanService.getAllGoalsForPrisoner.mockResolvedValue({
      prisonNumber,
      goals: {
        ACTIVE: [inProgressGoal],
        ARCHIVED: [archivedGoal],
        COMPLETED: [completedGoal],
      },
      problemRetrievingData: false,
    } as PrisonerGoals)

    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: aValidInductionDto(),
    }

    res.locals.actionPlanReviews = aValidActionPlanReviews()

    const expectedView = {
      tab: 'overview',
      prisonerSummary,
      functionalSkills: {
        problemRetrievingData: false,
        mostRecentAssessments: [{ type: 'ENGLISH' }, { type: 'MATHS' }],
      },
      inPrisonCourses: {
        problemRetrievingData: false,
        coursesCompletedInLast12Months: inPrisonCourses.coursesCompletedInLast12Months,
        hasCoursesCompletedMoreThan12MonthsAgo: true,
        hasWithdrawnOrInProgressCourses: true,
      },
      induction: {
        problemRetrievingData: false,
        isPostInduction: true,
      },
      prisonerGoals: {
        problemRetrievingData: false,
        counts: {
          totalGoals: 3,
          activeGoals: 1,
          archivedGoals: 1,
          completedGoals: 1,
        },
        lastUpdatedBy: inProgressGoal.updatedByDisplayName,
        lastUpdatedDate: inProgressGoal.updatedAt,
        lastUpdatedAtPrisonName: inProgressGoal.updatedAtPrisonName,
      },
      sessionHistory: {
        counts: {
          inductionSessions: 1,
          reviewSessions: 1,
          totalSessions: 2,
        },
        lastSessionConductedAt: parseISO('2023-06-19T09:39:44.000Z'),
        lastSessionConductedAtPrison: 'Moorland (HMP & YOI)',
        lastSessionConductedBy: 'Alex Smith',
        problemRetrievingData: false,
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })

  it('should get overview view for pre induction with no reviews, goals and no courses', async () => {
    // Given
    res.locals.curiousInPrisonCourses = {
      problemRetrievingData: false,
      prisonNumber,
      totalRecords: 0,
      coursesByStatus: {
        COMPLETED: [],
        IN_PROGRESS: [],
        WITHDRAWN: [],
        TEMPORARILY_WITHDRAWN: [],
      },
      coursesCompletedInLast12Months: [],
    } as InPrisonCourseRecords

    educationAndWorkPlanService.getAllGoalsForPrisoner.mockResolvedValue({
      prisonNumber,
      goals: {
        ACTIVE: [],
        ARCHIVED: [],
        COMPLETED: [],
      },
      problemRetrievingData: false,
    } as PrisonerGoals)

    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: undefined,
    }

    res.locals.actionPlanReviews = {
      problemRetrievingData: false,
      completedReviews: [],
      latestReviewSchedule: undefined,
    }

    const expectedView = {
      tab: 'overview',
      prisonerSummary,
      functionalSkills: {
        problemRetrievingData: false,
        mostRecentAssessments: [{ type: 'ENGLISH' }, { type: 'MATHS' }],
      },
      inPrisonCourses: {
        problemRetrievingData: false,
        coursesCompletedInLast12Months: [] as Array<InPrisonCourse>,
        hasCoursesCompletedMoreThan12MonthsAgo: false,
        hasWithdrawnOrInProgressCourses: false,
      },
      induction: {
        problemRetrievingData: false,
        isPostInduction: false,
      },
      prisonerGoals: {
        problemRetrievingData: false,
        counts: {
          totalGoals: 0,
          activeGoals: 0,
          archivedGoals: 0,
          completedGoals: 0,
        },
        lastUpdatedBy: undefined as string,
        lastUpdatedDate: undefined as string,
        lastUpdatedAtPrisonName: undefined as string,
      },
      sessionHistory: {
        problemRetrievingData: false,
        counts: {
          totalSessions: 0,
          reviewSessions: 0,
          inductionSessions: 0,
        },
        lastSessionConductedAt: undefined as Date,
        lastSessionConductedAtPrison: undefined as string,
        lastSessionConductedBy: undefined as string,
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })

  it('should get overview view when there is an error retrieving the action plan', async () => {
    // Given
    res.locals.curiousInPrisonCourses = {
      problemRetrievingData: false,
      prisonNumber,
      totalRecords: 0,
      coursesByStatus: {
        COMPLETED: [],
        IN_PROGRESS: [],
        WITHDRAWN: [],
        TEMPORARILY_WITHDRAWN: [],
      },
      coursesCompletedInLast12Months: [],
    } as InPrisonCourseRecords

    educationAndWorkPlanService.getAllGoalsForPrisoner.mockResolvedValue({
      prisonNumber,
      goals: {
        ACTIVE: [],
        ARCHIVED: [],
        COMPLETED: [],
      },
      problemRetrievingData: true,
    } as PrisonerGoals)

    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: aValidInductionDto(),
    }

    res.locals.actionPlanReviews = aValidActionPlanReviews()

    const expectedView = {
      tab: 'overview',
      prisonerSummary,
      functionalSkills: {
        problemRetrievingData: false,
        mostRecentAssessments: [{ type: 'ENGLISH' }, { type: 'MATHS' }],
      },
      inPrisonCourses: {
        problemRetrievingData: false,
        coursesCompletedInLast12Months: inPrisonCourses.coursesCompletedInLast12Months,
        hasCoursesCompletedMoreThan12MonthsAgo: false,
        hasWithdrawnOrInProgressCourses: false,
      },
      induction: {
        problemRetrievingData: false,
        isPostInduction: true,
      },
      prisonerGoals: {
        problemRetrievingData: true,
        counts: {
          totalGoals: 0,
          activeGoals: 0,
          archivedGoals: 0,
          completedGoals: 0,
        },
        lastUpdatedBy: undefined as string,
        lastUpdatedDate: undefined as string,
        lastUpdatedAtPrisonName: undefined as string,
      },
      sessionHistory: {
        counts: {
          inductionSessions: 1,
          reviewSessions: 1,
          totalSessions: 2,
        },
        lastSessionConductedAt: parseISO('2023-06-19T09:39:44.000Z'),
        lastSessionConductedAtPrison: 'Moorland (HMP & YOI)',
        lastSessionConductedBy: 'Alex Smith',
        problemRetrievingData: false,
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })

  it('should get overview when there is an error retrieving the induction', async () => {
    // Given
    const inProgressGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ACTIVE,
      updatedAt: new Date('2023-09-23T13:42:01.401Z'),
    }
    const archivedGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ARCHIVED,
      updatedAt: new Date('2023-08-23T13:42:01.401Z'),
    }
    const completedGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.COMPLETED,
      updatedAt: new Date('2023-07-23T13:42:01.401Z'),
    }

    educationAndWorkPlanService.getAllGoalsForPrisoner.mockResolvedValue({
      prisonNumber,
      goals: {
        ACTIVE: [inProgressGoal],
        ARCHIVED: [archivedGoal],
        COMPLETED: [completedGoal],
      },
      problemRetrievingData: false,
    } as PrisonerGoals)

    res.locals.induction = {
      problemRetrievingData: true,
      inductionDto: undefined,
    }

    res.locals.actionPlanReviews = aValidActionPlanReviews()

    const expectedView = {
      tab: 'overview',
      prisonerSummary,
      functionalSkills: {
        problemRetrievingData: false,
        mostRecentAssessments: [{ type: 'ENGLISH' }, { type: 'MATHS' }],
      },
      inPrisonCourses: {
        problemRetrievingData: false,
        coursesCompletedInLast12Months: inPrisonCourses.coursesCompletedInLast12Months,
        hasCoursesCompletedMoreThan12MonthsAgo: true,
        hasWithdrawnOrInProgressCourses: true,
      },
      induction: {
        problemRetrievingData: true,
        isPostInduction: undefined as boolean,
      },
      prisonerGoals: {
        problemRetrievingData: false,
        counts: {
          totalGoals: 3,
          activeGoals: 1,
          archivedGoals: 1,
          completedGoals: 1,
        },
        lastUpdatedBy: inProgressGoal.updatedByDisplayName,
        lastUpdatedDate: inProgressGoal.updatedAt,
        lastUpdatedAtPrisonName: inProgressGoal.updatedAtPrisonName,
      },
      sessionHistory: {
        counts: {
          inductionSessions: 0,
          reviewSessions: 1,
          totalSessions: 1,
        },
        lastSessionConductedAt: undefined as string,
        lastSessionConductedAtPrison: undefined as string,
        lastSessionConductedBy: undefined as string,
        problemRetrievingData: true,
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })

  it('should get overview when there is an error retrieving the action plan reviews', async () => {
    // Given
    const inProgressGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ACTIVE,
      updatedAt: new Date('2023-09-23T13:42:01.401Z'),
    }
    const archivedGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ARCHIVED,
      updatedAt: new Date('2023-08-23T13:42:01.401Z'),
    }
    const completedGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.COMPLETED,
      updatedAt: new Date('2023-07-23T13:42:01.401Z'),
    }

    educationAndWorkPlanService.getAllGoalsForPrisoner.mockResolvedValue({
      prisonNumber,
      goals: {
        ACTIVE: [inProgressGoal],
        ARCHIVED: [archivedGoal],
        COMPLETED: [completedGoal],
      },
      problemRetrievingData: false,
    } as PrisonerGoals)

    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: aValidInductionDto(),
    }

    res.locals.actionPlanReviews = {
      problemRetrievingData: true,
      completedReviews: [],
      latestReviewSchedule: undefined,
    }

    const expectedView = {
      tab: 'overview',
      prisonerSummary,
      functionalSkills: {
        problemRetrievingData: false,
        mostRecentAssessments: [{ type: 'ENGLISH' }, { type: 'MATHS' }],
      },
      inPrisonCourses: {
        problemRetrievingData: false,
        coursesCompletedInLast12Months: inPrisonCourses.coursesCompletedInLast12Months,
        hasCoursesCompletedMoreThan12MonthsAgo: true,
        hasWithdrawnOrInProgressCourses: true,
      },
      induction: {
        problemRetrievingData: false,
        isPostInduction: true,
      },
      prisonerGoals: {
        problemRetrievingData: false,
        counts: {
          totalGoals: 3,
          activeGoals: 1,
          archivedGoals: 1,
          completedGoals: 1,
        },
        lastUpdatedBy: inProgressGoal.updatedByDisplayName,
        lastUpdatedDate: inProgressGoal.updatedAt,
        lastUpdatedAtPrisonName: inProgressGoal.updatedAtPrisonName,
      },
      sessionHistory: {
        counts: {
          inductionSessions: 1,
          reviewSessions: 0,
          totalSessions: 1,
        },
        lastSessionConductedAt: undefined as string,
        lastSessionConductedAtPrison: undefined as string,
        lastSessionConductedBy: undefined as string,
        problemRetrievingData: true,
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })

  it('should get overview view when there is an error retrieving the curious in-prison courses', async () => {
    // Given
    const inProgressGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ACTIVE,
      updatedAt: new Date('2023-09-23T13:42:01.401Z'),
    }
    const archivedGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ARCHIVED,
      updatedAt: new Date('2023-08-23T13:42:01.401Z'),
    }
    const completedGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.COMPLETED,
      updatedAt: new Date('2023-07-23T13:42:01.401Z'),
    }

    educationAndWorkPlanService.getAllGoalsForPrisoner.mockResolvedValue({
      prisonNumber,
      goals: {
        ACTIVE: [inProgressGoal],
        ARCHIVED: [archivedGoal],
        COMPLETED: [completedGoal],
      },
      problemRetrievingData: false,
    } as PrisonerGoals)

    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: aValidInductionDto(),
    }

    res.locals.actionPlanReviews = aValidActionPlanReviews()

    res.locals.curiousInPrisonCourses = { problemRetrievingData: true }

    const expectedView = {
      tab: 'overview',
      prisonerSummary,
      functionalSkills: {
        problemRetrievingData: false,
        mostRecentAssessments: [{ type: 'ENGLISH' }, { type: 'MATHS' }],
      },
      inPrisonCourses: {
        problemRetrievingData: true,
        coursesCompletedInLast12Months: undefined as Array<InPrisonCourse>,
        hasCoursesCompletedMoreThan12MonthsAgo: undefined as boolean,
        hasWithdrawnOrInProgressCourses: undefined as boolean,
      },
      induction: {
        problemRetrievingData: false,
        isPostInduction: true,
      },
      prisonerGoals: {
        problemRetrievingData: false,
        counts: {
          totalGoals: 3,
          activeGoals: 1,
          archivedGoals: 1,
          completedGoals: 1,
        },
        lastUpdatedBy: inProgressGoal.updatedByDisplayName,
        lastUpdatedDate: inProgressGoal.updatedAt,
        lastUpdatedAtPrisonName: inProgressGoal.updatedAtPrisonName,
      },
      sessionHistory: {
        counts: {
          inductionSessions: 1,
          reviewSessions: 1,
          totalSessions: 2,
        },
        lastSessionConductedAt: parseISO('2023-06-19T09:39:44.000Z'),
        lastSessionConductedAtPrison: 'Moorland (HMP & YOI)',
        lastSessionConductedBy: 'Alex Smith',
        problemRetrievingData: false,
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })

  it('should get overview view when there is an error retrieving the curious functional skills', async () => {
    // Given
    const inProgressGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ACTIVE,
      updatedAt: new Date('2023-09-23T13:42:01.401Z'),
    }
    const archivedGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.ARCHIVED,
      updatedAt: new Date('2023-08-23T13:42:01.401Z'),
    }
    const completedGoal = {
      ...aValidGoalResponse(),
      status: GoalStatusValue.COMPLETED,
      updatedAt: new Date('2023-07-23T13:42:01.401Z'),
    }

    educationAndWorkPlanService.getAllGoalsForPrisoner.mockResolvedValue({
      prisonNumber,
      goals: {
        ACTIVE: [inProgressGoal],
        ARCHIVED: [archivedGoal],
        COMPLETED: [completedGoal],
      },
      problemRetrievingData: false,
    } as PrisonerGoals)

    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: aValidInductionDto(),
    }

    res.locals.actionPlanReviews = aValidActionPlanReviews()

    res.locals.prisonerFunctionalSkills = {
      problemRetrievingData: true,
    }

    const expectedView = {
      tab: 'overview',
      prisonerSummary,
      functionalSkills: {
        problemRetrievingData: true,
        mostRecentAssessments: undefined as Array<Assessment>,
      },
      inPrisonCourses: {
        problemRetrievingData: false,
        coursesCompletedInLast12Months: inPrisonCourses.coursesCompletedInLast12Months,
        hasCoursesCompletedMoreThan12MonthsAgo: true,
        hasWithdrawnOrInProgressCourses: true,
      },
      induction: {
        problemRetrievingData: false,
        isPostInduction: true,
      },
      prisonerGoals: {
        problemRetrievingData: false,
        counts: {
          totalGoals: 3,
          activeGoals: 1,
          archivedGoals: 1,
          completedGoals: 1,
        },
        lastUpdatedBy: inProgressGoal.updatedByDisplayName,
        lastUpdatedDate: inProgressGoal.updatedAt,
        lastUpdatedAtPrisonName: inProgressGoal.updatedAtPrisonName,
      },
      sessionHistory: {
        counts: {
          inductionSessions: 1,
          reviewSessions: 1,
          totalSessions: 2,
        },
        lastSessionConductedAt: parseISO('2023-06-19T09:39:44.000Z'),
        lastSessionConductedAtPrison: 'Moorland (HMP & YOI)',
        lastSessionConductedBy: 'Alex Smith',
        problemRetrievingData: false,
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })
})
