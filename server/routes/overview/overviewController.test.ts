import createError from 'http-errors'
import { Request, Response } from 'express'
import type { FunctionalSkills, Goals, InPrisonCourseRecords } from 'viewModels'
import OverviewController from './overviewController'
import CuriousService from '../../services/curiousService'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import InductionService from '../../services/inductionService'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'
import { aValidEnglishInPrisonCourse, aValidMathsInPrisonCourse } from '../../testsupport/inPrisonCourseTestDataBuilder'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import GoalStatusValue from '../../enums/goalStatusValue'

jest.mock('../../services/curiousService')
jest.mock('../../services/educationAndWorkPlanService')
jest.mock('../../services/inductionService')

describe('overviewController', () => {
  const curiousService = new CuriousService(null, null, null) as jest.Mocked<CuriousService>
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const inductionService = new InductionService(null) as jest.Mocked<InductionService>

  const controller = new OverviewController(curiousService, educationAndWorkPlanService, inductionService)

  const prisonNumber = 'A1234GC'
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

  let req: Request
  const res = {
    render: jest.fn(),
    locals: {
      curiousInPrisonCourses: inPrisonCourses,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary },
      user: {
        username: 'a-dps-user',
        token: 'a-user-token',
      },
      params: { prisonNumber },
    } as unknown as Request
  })

  it('should get overview view given CIAG Induction and PLP Action Plan both exist', async () => {
    // Given
    const expectedTab = 'overview'
    req.params.tab = expectedTab

    inductionService.inductionExists.mockResolvedValue(true)

    const goals: Goals = { goals: [aValidGoal()], problemRetrievingData: false }
    educationAndWorkPlanService.getGoalsByStatus.mockResolvedValue(goals)

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

    const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
    const expectedView = {
      prisonerSummary: expectedPrisonerSummary,
      tab: expectedTab,
      prisonNumber,
      goals,
      functionalSkills: expectedFunctionalSkills,
      inPrisonCourses,
      isPostInduction: true,
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    expect(educationAndWorkPlanService.getGoalsByStatus).toHaveBeenCalledWith(
      prisonNumber,
      GoalStatusValue.ACTIVE,
      'a-user-token',
    )
    expect(inductionService.inductionExists).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
  })

  it('should get overview view given CIAG Induction does not exist', async () => {
    // Given
    const expectedTab = 'overview'
    req.params.tab = expectedTab

    inductionService.inductionExists.mockResolvedValue(false)

    const goals: Goals = { goals: undefined, problemRetrievingData: false }
    educationAndWorkPlanService.getGoalsByStatus.mockResolvedValue(goals)

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

    const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
    const expectedView = {
      prisonerSummary: expectedPrisonerSummary,
      tab: expectedTab,
      prisonNumber,
      goals,
      functionalSkills: expectedFunctionalSkills,
      inPrisonCourses,
      isPostInduction: false,
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    expect(educationAndWorkPlanService.getGoalsByStatus).toHaveBeenCalledWith(
      prisonNumber,
      GoalStatusValue.ACTIVE,
      'a-user-token',
    )
    expect(inductionService.inductionExists).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
  })

  it('should not get overview view given CIAG Induction throws an error', async () => {
    // Given
    const expectedTab = 'overview'
    req.params.tab = expectedTab

    inductionService.inductionExists.mockRejectedValue(createError(500, 'Service unavailable'))

    const expectedError = createError(
      500,
      `Error checking whether a CIAG Induction exists for prisoner ${prisonNumber}`,
    )

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith(expectedError)
    expect(res.render).not.toHaveBeenCalled()
    expect(inductionService.inductionExists).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
    expect(educationAndWorkPlanService.getGoalsByStatus).not.toHaveBeenCalled()
    expect(curiousService.getPrisonerFunctionalSkills).not.toHaveBeenCalled()
  })
})
