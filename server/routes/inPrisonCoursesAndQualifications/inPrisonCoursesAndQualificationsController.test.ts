import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
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

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    render: jest.fn(),
    locals: {} as Record<string, unknown>,
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>
    res.locals = {} as Record<string, unknown>
  })

  describe('getInPrisonCoursesAndQualificationsView', () => {
    it('should get In Prison Courses And Qualifications view', async () => {
      // Given
      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary(prisonNumber)
      req.session.prisonerSummary = prisonerSummary

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
      await controller.getInPrisonCoursesAndQualificationsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/inPrisonCoursesAndQualifications/index', expectedView)
    })
  })
})
