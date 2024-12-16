import { Request, Response } from 'express'
import type { Assessment, FunctionalSkills, InPrisonCourse, InPrisonCourseRecords } from 'viewModels'
import { add, parseISO, startOfDay, startOfToday, sub } from 'date-fns'
import { aValidEnglishInPrisonCourse, aValidMathsInPrisonCourse } from '../../testsupport/inPrisonCourseTestDataBuilder'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidGoalResponse } from '../../testsupport/actionPlanResponseTestDataBuilder'
import GoalStatusValue from '../../enums/goalStatusValue'
import OverviewController from './overviewController'
import aValidActionPlanReviews from '../../testsupport/actionPlanReviewsTestDataBuilder'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import aValidScheduledActionPlanReview from '../../testsupport/scheduledActionPlanReviewTestDataBuilder'
import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'

describe('overviewController', () => {
  const controller = new OverviewController()

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)
  const today = startOfToday()

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

  const inProgressGoal = {
    ...aValidGoalResponse(),
    status: GoalStatusValue.ACTIVE,
    updatedAt: parseISO('2023-09-23T13:42:01.401Z'),
  }
  const archivedGoal = {
    ...aValidGoalResponse(),
    status: GoalStatusValue.ARCHIVED,
    updatedAt: parseISO('2023-08-23T13:42:01.401Z'),
  }
  const completedGoal = {
    ...aValidGoalResponse(),
    status: GoalStatusValue.COMPLETED,
    updatedAt: parseISO('2023-07-23T13:42:01.401Z'),
  }

  const req = {
    session: {},
    user: { username },
    params: { prisonNumber },
  } as unknown as Request
  const render = jest.fn()
  const res = {
    render,
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    res.locals = {
      prisonerSummary,
      curiousInPrisonCourses: inPrisonCourses,
      prisonerFunctionalSkills: functionalSkillsFromCurious,
      allGoalsForPrisoner: {
        prisonNumber,
        goals: {
          ACTIVE: [inProgressGoal],
          ARCHIVED: [archivedGoal],
          COMPLETED: [completedGoal],
        },
        problemRetrievingData: false,
      },
    }
    jest.resetAllMocks()
  })

  it('should get overview view given Induction, Goals, and Action Plan Reviews all exist', async () => {
    // Given
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
          totalCompletedSessions: 2,
        },
        lastSessionConductedAt: parseISO('2023-06-19T09:39:44.000Z'),
        lastSessionConductedAtPrison: 'Moorland (HMP & YOI)',
        lastSessionConductedBy: 'Alex Smith',
        problemRetrievingData: false,
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'OVERDUE',
        reviewDueDate: startOfDay('2024-10-15'),
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })

  it('should get overview view given prisoner has no latest review schedule', async () => {
    // Given
    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: aValidInductionDto(),
    }

    res.locals.actionPlanReviews = {
      ...aValidActionPlanReviews(),
      latestReviewSchedule: undefined,
    }

    const expected = {
      problemRetrievingData: false,
      reviewStatus: 'NO_SCHEDULED_REVIEW',
      reviewDueDate: undefined as Date,
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    const renderedView = render.mock.calls[0][1]
    expect(renderedView.actionPlanReview).toEqual(expected)
  })

  it('should get overview view given latest review schedule was Completed', async () => {
    // Given
    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: aValidInductionDto(),
    }

    res.locals.actionPlanReviews = aValidActionPlanReviews({
      latestReviewSchedule: aValidScheduledActionPlanReview({
        status: ActionPlanReviewStatusValue.COMPLETED,
      }),
    })

    const expected = {
      problemRetrievingData: false,
      reviewStatus: 'NO_SCHEDULED_REVIEW',
      reviewDueDate: undefined as Date,
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    const renderedView = render.mock.calls[0][1]
    expect(renderedView.actionPlanReview).toEqual(expected)
  })

  it('should get overview view given latest review schedule is scheduled but is not due', async () => {
    // Given
    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: aValidInductionDto(),
    }

    res.locals.actionPlanReviews = aValidActionPlanReviews({
      latestReviewSchedule: aValidScheduledActionPlanReview({
        status: ActionPlanReviewStatusValue.SCHEDULED,
        reviewDateFrom: add(today, { months: 1 }),
        reviewDateTo: add(today, { months: 3 }),
      }),
    })

    const expected = {
      problemRetrievingData: false,
      reviewStatus: 'NOT_DUE',
      reviewDueDate: add(today, { months: 3 }),
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    const renderedView = render.mock.calls[0][1]
    expect(renderedView.actionPlanReview).toEqual(expected)
  })

  it('should get overview view given latest review schedule is scheduled but is due', async () => {
    // Given
    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: aValidInductionDto(),
    }

    res.locals.actionPlanReviews = aValidActionPlanReviews({
      latestReviewSchedule: aValidScheduledActionPlanReview({
        status: ActionPlanReviewStatusValue.SCHEDULED,
        reviewDateFrom: sub(today, { months: 1 }),
        reviewDateTo: add(today, { months: 1 }),
      }),
    })

    const expected = {
      problemRetrievingData: false,
      reviewStatus: 'DUE',
      reviewDueDate: add(today, { months: 1 }),
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    const renderedView = render.mock.calls[0][1]
    expect(renderedView.actionPlanReview).toEqual(expected)
  })

  it('should get overview view given latest review schedule is scheduled but is overdue', async () => {
    // Given
    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: aValidInductionDto(),
    }

    res.locals.actionPlanReviews = aValidActionPlanReviews({
      latestReviewSchedule: aValidScheduledActionPlanReview({
        status: ActionPlanReviewStatusValue.SCHEDULED,
        reviewDateFrom: sub(today, { months: 1 }),
        reviewDateTo: sub(today, { days: 1 }),
      }),
    })

    const expected = {
      problemRetrievingData: false,
      reviewStatus: 'OVERDUE',
      reviewDueDate: sub(today, { days: 1 }),
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    const renderedView = render.mock.calls[0][1]
    expect(renderedView.actionPlanReview).toEqual(expected)
  })

  it('should get overview view given Induction and Goals exist, but an Action Plan Reviews was not retrieved at all', async () => {
    // Given
    res.locals.induction = {
      problemRetrievingData: false,
      inductionDto: aValidInductionDto(),
    }

    res.locals.actionPlanReviews = undefined

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
          reviewSessions: undefined as number,
          totalCompletedSessions: 1,
        },
        lastSessionConductedAt: parseISO('2023-06-19T09:39:44.000Z'),
        lastSessionConductedAtPrison: 'MDI',
        lastSessionConductedBy: 'Alex Smith',
        problemRetrievingData: false,
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
        reviewDueDate: undefined as Date,
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

    res.locals.allGoalsForPrisoner = {
      prisonNumber,
      goals: {
        ACTIVE: [],
        ARCHIVED: [],
        COMPLETED: [],
      },
      problemRetrievingData: false,
    }

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
          totalCompletedSessions: 0,
          reviewSessions: 0,
          inductionSessions: 0,
        },
        lastSessionConductedAt: undefined as Date,
        lastSessionConductedAtPrison: undefined as string,
        lastSessionConductedBy: undefined as string,
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
        reviewDueDate: undefined as Date,
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

    res.locals.allGoalsForPrisoner = {
      prisonNumber,
      goals: {
        ACTIVE: [],
        ARCHIVED: [],
        COMPLETED: [],
      },
      problemRetrievingData: true,
    }

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
          inductionSessions: 0,
          reviewSessions: 1,
          totalCompletedSessions: 0,
        },
        lastSessionConductedAt: undefined as Date,
        lastSessionConductedAtPrison: undefined as string,
        lastSessionConductedBy: undefined as string,
        problemRetrievingData: false,
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'OVERDUE',
        reviewDueDate: startOfDay('2024-10-15'),
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })

  it('should get overview when there is an error retrieving the induction', async () => {
    // Given
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
          totalCompletedSessions: 0,
        },
        lastSessionConductedAt: undefined as string,
        lastSessionConductedAtPrison: undefined as string,
        lastSessionConductedBy: undefined as string,
        problemRetrievingData: true,
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'OVERDUE',
        reviewDueDate: startOfDay('2024-10-15'),
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })

  it('should get overview when there is an error retrieving the action plan reviews', async () => {
    // Given
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
          totalCompletedSessions: 1,
        },
        lastSessionConductedAt: undefined as string,
        lastSessionConductedAtPrison: undefined as string,
        lastSessionConductedBy: undefined as string,
        problemRetrievingData: true,
      },
      actionPlanReview: {
        problemRetrievingData: true,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
        reviewDueDate: undefined as Date,
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })

  it('should get overview view when there is an error retrieving the curious in-prison courses', async () => {
    // Given
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
          totalCompletedSessions: 2,
        },
        lastSessionConductedAt: parseISO('2023-06-19T09:39:44.000Z'),
        lastSessionConductedAtPrison: 'Moorland (HMP & YOI)',
        lastSessionConductedBy: 'Alex Smith',
        problemRetrievingData: false,
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'OVERDUE',
        reviewDueDate: startOfDay('2024-10-15'),
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })

  it('should get overview view when there is an error retrieving the curious functional skills', async () => {
    // Given
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
          totalCompletedSessions: 2,
        },
        lastSessionConductedAt: parseISO('2023-06-19T09:39:44.000Z'),
        lastSessionConductedAtPrison: 'Moorland (HMP & YOI)',
        lastSessionConductedBy: 'Alex Smith',
        problemRetrievingData: false,
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'OVERDUE',
        reviewDueDate: startOfDay('2024-10-15'),
      },
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })
})
