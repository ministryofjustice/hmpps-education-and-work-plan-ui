import { Request, Response } from 'express'
import { parse, startOfDay } from 'date-fns'
import type { FunctionalSkills, InPrisonCourseRecords } from 'viewModels'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aValidEnglishInPrisonCourse,
  aValidEnglishInPrisonCourseCompletedWithinLast12Months,
  aValidMathsInPrisonCourse,
} from '../../testsupport/inPrisonCourseTestDataBuilder'
import EducationAndTrainingController from './educationAndTrainingController'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'

describe('educationAndTrainingController', () => {
  const controller = new EducationAndTrainingController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  const induction = {
    problemRetrievingData: false,
    inductionDto: aValidInductionDto(),
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
  const functionalSkillsFromCurious: FunctionalSkills = {
    prisonNumber,
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
  }
  const educationDto = aValidEducationDto()

  const expectedTab = 'education-and-training'

  const req = {
    user: {
      username: 'a-dps-user',
    },
    params: {
      prisonNumber,
      tab: expectedTab,
    },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      prisonerSummary,
      curiousInPrisonCourses: inPrisonCourses,
      prisonerFunctionalSkills: functionalSkillsFromCurious,
      education: educationDto,
      induction,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get eduction and training view', async () => {
    // Given
    const expectedFunctionalSkills: FunctionalSkills = {
      prisonNumber,
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
          assessmentDate: undefined,
          grade: undefined,
          prisonId: undefined,
          prisonName: undefined,
        },
      ],
    }

    const expectedView = {
      prisonerSummary,
      tab: expectedTab,
      functionalSkills: expectedFunctionalSkills,
      inPrisonCourses,
      induction,
      education: educationDto,
    }

    // When
    await controller.getEducationAndTrainingView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })
})
