import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import type { InPrisonCourseRecords } from 'viewModels'
import { CuriousService } from '../../services'
import { aValidEnglishInPrisonCourse, aValidMathsInPrisonCourse } from '../../testsupport/inPrisonCourseTestDataBuilder'
import retrieveCuriousInPrisonCourses from './retrieveCuriousInPrisonCourses'

describe('retrieveCuriousInPrisonCourses', () => {
  const req = {
    user: {} as Express.User,
    session: {} as SessionData,
    params: {} as Record<string, string>,
    query: {} as Record<string, string>,
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    locals: {} as Record<string, unknown>,
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.user = {} as Express.User
    req.session = {} as SessionData
    req.params = {} as Record<string, string>
    req.query = {} as Record<string, string>
    req.path = ''
    res.locals = {} as Record<string, unknown>
  })

  const curiousService = {
    getPrisonerInPrisonCourses: jest.fn(),
  }

  const requestHandler = retrieveCuriousInPrisonCourses(curiousService as unknown as CuriousService)

  it('should retrieve prisoner In Prison Courses given In Prison Courses not already on res.locals', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    res.locals.curiousInPrisonCourses = undefined

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber
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
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(curiousService.getPrisonerInPrisonCourses).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.curiousInPrisonCourses).toEqual(expectedInPrisonCourses)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve prisoner In Prison Courses given In Prison Courses for a different prisoner already in res.locals', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    res.locals.curiousInPrisonCourses = {
      problemRetrievingData: false,
      prisonNumber: 'Z1234XY',
      totalRecords: 2,
      coursesByStatus: {
        COMPLETED: [aValidMathsInPrisonCourse()],
        IN_PROGRESS: [aValidEnglishInPrisonCourse()],
        WITHDRAWN: [],
        TEMPORARILY_WITHDRAWN: [],
      },
      coursesCompletedInLast12Months: [],
    }

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber
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
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(curiousService.getPrisonerInPrisonCourses).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.curiousInPrisonCourses).toEqual(expectedInPrisonCourses)
    expect(next).toHaveBeenCalled()
  })

  it('should not retrieve In Prison Courses given In Prison Courses for prisoner already in res.locals', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    const prisonNumber = 'A1234GC'

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
    res.locals.curiousInPrisonCourses = expectedInPrisonCourses

    req.params.prisonNumber = prisonNumber

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(curiousService.getPrisonerInPrisonCourses).not.toHaveBeenCalled()
    expect(res.locals.curiousInPrisonCourses).toEqual(expectedInPrisonCourses)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve In Prison Courses and store in res.locals given In Prison Courses with problem retrieving data already in res.locals', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    res.locals.curiousInPrisonCourses = {
      problemRetrievingData: true,
      prisonNumber,
    }

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
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(curiousService.getPrisonerInPrisonCourses).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.curiousInPrisonCourses).toEqual(expectedInPrisonCourses)
    expect(next).toHaveBeenCalled()
  })
})
