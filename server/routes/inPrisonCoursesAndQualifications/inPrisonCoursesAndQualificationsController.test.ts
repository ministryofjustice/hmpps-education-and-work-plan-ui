import { Request, Response } from 'express'
import type { InPrisonCourseRecords } from 'viewModels'
import InPrisonCoursesAndQualificationsController from './inPrisonCoursesAndQualificationsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aValidEnglishInPrisonCourse,
  aValidMathsInPrisonCourse,
  aValidWoodWorkingInPrisonCourse,
} from '../../testsupport/inPrisonCourseTestDataBuilder'

describe('inPrisonCoursesAndQualificationsController', () => {
  const controller = new InPrisonCoursesAndQualificationsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary },
      params: { prisonNumber },
    } as unknown as Request

    res = {
      render: jest.fn(),
      locals: {} as Record<string, unknown>,
    } as unknown as Response
  })

  describe('getInPrisonCoursesAndQualificationsViewForPlp', () => {
    it('should get In Prison Courses And Qualifications view for use with PLP', async () => {
      // Given

      const completedCourse = aValidMathsInPrisonCourse()
      const inProgressCourse = aValidEnglishInPrisonCourse()
      const withdrawnCourse = aValidWoodWorkingInPrisonCourse()
      withdrawnCourse.courseStatus = 'WITHDRAWN'
      const temporarilyWithdrawnCourse = aValidEnglishInPrisonCourse()
      temporarilyWithdrawnCourse.courseStatus = 'TEMPORARILY_WITHDRAWN'

      const inPrisonCourses: InPrisonCourseRecords = {
        problemRetrievingData: false,
        prisonNumber,
        totalRecords: 2,
        coursesByStatus: {
          COMPLETED: [completedCourse],
          IN_PROGRESS: [inProgressCourse],
          WITHDRAWN: [withdrawnCourse],
          TEMPORARILY_WITHDRAWN: [temporarilyWithdrawnCourse],
        },
        coursesCompletedInLast12Months: [],
      }
      res.locals.curiousInPrisonCourses = inPrisonCourses

      const expectedView = {
        prisonerSummary,
        problemRetrievingData: false,
        completedCourses: [completedCourse],
        inProgressCourses: [inProgressCourse],
        withdrawnCourses: [withdrawnCourse, temporarilyWithdrawnCourse],
      }

      // When
      await controller.getInPrisonCoursesAndQualificationsViewForPlp(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/inPrisonCoursesAndQualifications/plpTemplate', expectedView)
    })
  })

  describe('getInPrisonCoursesAndQualificationsViewForDps', () => {
    it('should get In Prison Courses And Qualifications view for use with DPS', async () => {
      // Given
      const completedCourse = aValidMathsInPrisonCourse()
      const inProgressCourse = aValidEnglishInPrisonCourse()
      const withdrawnCourse = aValidWoodWorkingInPrisonCourse()
      withdrawnCourse.courseStatus = 'WITHDRAWN'
      const temporarilyWithdrawnCourse = aValidEnglishInPrisonCourse()
      temporarilyWithdrawnCourse.courseStatus = 'TEMPORARILY_WITHDRAWN'

      const inPrisonCourses: InPrisonCourseRecords = {
        problemRetrievingData: false,
        prisonNumber,
        totalRecords: 2,
        coursesByStatus: {
          COMPLETED: [completedCourse],
          IN_PROGRESS: [inProgressCourse],
          WITHDRAWN: [withdrawnCourse],
          TEMPORARILY_WITHDRAWN: [temporarilyWithdrawnCourse],
        },
        coursesCompletedInLast12Months: [],
      }
      res.locals.curiousInPrisonCourses = inPrisonCourses

      const expectedView = {
        prisonerSummary,
        problemRetrievingData: false,
        completedCourses: [completedCourse],
        inProgressCourses: [inProgressCourse],
        withdrawnCourses: [withdrawnCourse, temporarilyWithdrawnCourse],
      }

      // When
      await controller.getInPrisonCoursesAndQualificationsViewForDps(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/inPrisonCoursesAndQualifications/dpsTemplate', expectedView)
    })
  })
})
