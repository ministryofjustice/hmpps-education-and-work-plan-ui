import { Request, Response } from 'express'
import type { FunctionalSkills, InPrisonCourseRecords, PrisonerGoals } from 'viewModels'
import CuriousService from '../../services/curiousService'
import InductionService from '../../services/inductionService'
import { aValidEnglishInPrisonCourse, aValidMathsInPrisonCourse } from '../../testsupport/inPrisonCourseTestDataBuilder'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidGoalResponse } from '../../testsupport/actionPlanResponseTestDataBuilder'
import GoalStatusValue from '../../enums/goalStatusValue'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import OverviewController from './overviewController'

jest.mock('../../services/curiousService')
jest.mock('../../services/inductionService')
jest.mock('../../services/educationAndWorkPlanService')

describe('overviewController', () => {
  const curiousService = new CuriousService(null, null, null) as jest.Mocked<CuriousService>
  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>

  const controller = new OverviewController(curiousService, inductionService, educationAndWorkPlanService)

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
    locals: {
      prisonerSummary,
      curiousInPrisonCourses: inPrisonCourses,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get overview view given Induction and Action Plan both exist', async () => {
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

    inductionService.inductionExists.mockResolvedValue(true)

    curiousService.getPrisonerFunctionalSkills.mockResolvedValue(functionalSkillsFromCurious)

    const expectedView = {
      tab: 'overview',
      prisonerSummary,
      functionalSkills: functionalSkillsFromCurious,
      inPrisonCourses,
      isPostInduction: true,
      noGoals: false,
      goalCounts: {
        activeCount: 1,
        archivedCount: 1,
        completedCount: 1,
      },
      hasWithdrawnOrInProgressCourses: true,
      hasCoursesCompletedMoreThan12MonthsAgo: true,
      lastUpdatedBy: inProgressGoal.updatedByDisplayName,
      lastUpdatedDate: inProgressGoal.updatedAt,
      lastUpdatedAtPrisonName: inProgressGoal.updatedAtPrisonName,
      problemRetrievingData: false,
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    expect(inductionService.inductionExists).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should get overview view for pre induction with no goals and no courses', async () => {
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

    inductionService.inductionExists.mockResolvedValue(false)

    curiousService.getPrisonerFunctionalSkills.mockResolvedValue(functionalSkillsFromCurious)

    const expectedView = {
      tab: 'overview',
      prisonerSummary,
      functionalSkills: functionalSkillsFromCurious,
      inPrisonCourses: res.locals.curiousInPrisonCourses,
      isPostInduction: false,
      noGoals: true,
      goalCounts: {
        activeCount: 0,
        archivedCount: 0,
        completedCount: 0,
      },
      hasWithdrawnOrInProgressCourses: false,
      hasCoursesCompletedMoreThan12MonthsAgo: false,
      lastUpdatedBy: null as string,
      lastUpdatedDate: null as string,
      lastUpdatedAtPrisonName: null as string,
      problemRetrievingData: false,
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    expect(inductionService.inductionExists).toHaveBeenCalledWith(prisonNumber, username)
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

    inductionService.inductionExists.mockResolvedValue(false)

    curiousService.getPrisonerFunctionalSkills.mockResolvedValue(functionalSkillsFromCurious)

    const expectedView = {
      tab: 'overview',
      prisonerSummary,
      functionalSkills: functionalSkillsFromCurious,
      inPrisonCourses: res.locals.curiousInPrisonCourses,
      isPostInduction: false,
      noGoals: true,
      goalCounts: {
        activeCount: 0,
        archivedCount: 0,
        completedCount: 0,
      },
      hasWithdrawnOrInProgressCourses: false,
      hasCoursesCompletedMoreThan12MonthsAgo: false,
      lastUpdatedBy: null as string,
      lastUpdatedDate: null as string,
      lastUpdatedAtPrisonName: null as string,
      problemRetrievingData: true,
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    expect(inductionService.inductionExists).toHaveBeenCalledWith(prisonNumber, username)
  })
})
