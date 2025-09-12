import { Request, Response } from 'express'
import CuriousService from '../../services/curiousService'
import retrieveCuriousInPrisonCourses from './retrieveCuriousInPrisonCourses'
import validInPrisonCourseRecords from '../../testsupport/inPrisonCourseRecordsTestDataBuilder'

jest.mock('../../services/curiousService')

describe('retrieveCuriousInPrisonCourses', () => {
  const curiousService = new CuriousService(null, null) as jest.Mocked<CuriousService>
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
    const expectedInPrisonCourses = validInPrisonCourseRecords()
    curiousService.getPrisonerInPrisonCourses.mockResolvedValue(expectedInPrisonCourses)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(curiousService.getPrisonerInPrisonCourses).toHaveBeenCalledWith(prisonNumber)
    expect(res.locals.curiousInPrisonCourses).toEqual(expectedInPrisonCourses)
    expect(next).toHaveBeenCalled()
  })
})
