import { Request, Response } from 'express'
import { parse, startOfDay } from 'date-fns'
import type { FunctionalSkills, InPrisonCourseRecords } from 'viewModels'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aValidEnglishInPrisonCourse,
  aValidEnglishInPrisonCourseCompletedWithinLast12Months,
  aValidMathsInPrisonCourse,
} from '../../testsupport/inPrisonCourseTestDataBuilder'
import CuriousService from '../../services/curiousService'
import EducationAndTrainingController from './educationAndTrainingController'
import { aLongQuestionSetInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'

jest.mock('../../services/curiousService')

describe('educationAndTrainingController', () => {
  const curiousService = new CuriousService(null, null, null) as jest.Mocked<CuriousService>

  const controller = new EducationAndTrainingController(curiousService)

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  const induction = {
    problemRetrievingData: false,
    inductionDto: aLongQuestionSetInductionDto(),
  }

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

  const expectedTab = 'education-and-training'

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary },
      user: {
        username: 'a-dps-user',
      },
      params: {
        prisonNumber,
        tab: expectedTab,
      },
    } as unknown as Request
    res = {
      render: jest.fn(),
      locals: {
        curiousInPrisonCourses: inPrisonCourses,
        induction,
      },
    } as unknown as Response
  })

  it('should get eduction and training view', async () => {
    // Given
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

    const expectedView = {
      prisonerSummary,
      tab: expectedTab,
      functionalSkills: expectedFunctionalSkills,
      inPrisonCourses,
      induction,
    }

    // When
    await controller.getEducationAndTrainingView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, 'a-dps-user')
  })
})
