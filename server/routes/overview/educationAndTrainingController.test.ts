import { NextFunction, Request, Response } from 'express'
import { parse, startOfDay } from 'date-fns'
import type { FunctionalSkills, InPrisonCourseRecords } from 'viewModels'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aValidEnglishInPrisonCourse,
  aValidEnglishInPrisonCourseCompletedWithinLast12Months,
  aValidMathsInPrisonCourse,
} from '../../testsupport/inPrisonCourseTestDataBuilder'
import { aValidShortQuestionSetEducationAndTraining } from '../../testsupport/educationAndTrainingTestDataBuilder'
import CuriousService from '../../services/curiousService'
import InductionService from '../../services/inductionService'
import EducationAndTrainingController from './educationAndTrainingController'

jest.mock('../../services/curiousService')
jest.mock('../../services/inductionService')

describe('educationAndTrainingController', () => {
  const curiousService = new CuriousService(null, null, null) as jest.Mocked<CuriousService>
  const inductionService = new InductionService(null) as jest.Mocked<InductionService>

  const controller = new EducationAndTrainingController(curiousService, inductionService)

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

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

  it('should get eduction and training view', async () => {
    // Given
    const expectedTab = 'education-and-training'
    req.params.tab = expectedTab

    const functionalSkillsFromCurious = {
      problemRetrievingData: false,
      assessments: [
        {
          assessmentDate: startOfDay(parse('2012-02-16', 'yyyy-MM-dd', new Date())),
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
          assessmentDate: startOfDay(parse('2012-02-16', 'yyyy-MM-dd', new Date())),
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
