import { Request, Response } from 'express'
import type { InPrisonCourseRecords } from 'viewModels'
import CuriousService from '../../services/curiousService'
import { aValidEnglishInPrisonCourse, aValidMathsInPrisonCourse } from '../../testsupport/inPrisonCourseTestDataBuilder'
import retrieveCuriousInPrisonCourses from './retrieveCuriousInPrisonCourses'

jest.mock('../../services/curiousService')

describe('retrieveCuriousInPrisonCourses', () => {
  const curiousService = new CuriousService(null, null, null) as jest.Mocked<CuriousService>
  const requestHandler = retrieveCuriousInPrisonCourses(curiousService)

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'

  let req: Request
  const res = {
    locals: {} as Record<string, unknown>,
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { username },
      params: { prisonNumber },
    } as unknown as Request
  })

  it('should retrieve prisoner In Prison Courses', async () => {
    // Given
    const expectedInPrisonCourses: InPrisonCourseRecords = {
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
    curiousService.getPrisonerInPrisonCourses.mockResolvedValue(expectedInPrisonCourses)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(curiousService.getPrisonerInPrisonCourses).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.curiousInPrisonCourses).toEqual(expectedInPrisonCourses)
    expect(next).toHaveBeenCalled()
  })
})
