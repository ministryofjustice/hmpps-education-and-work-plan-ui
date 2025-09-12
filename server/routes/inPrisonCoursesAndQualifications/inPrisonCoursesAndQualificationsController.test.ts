import { Request, Response } from 'express'
import InPrisonCoursesAndQualificationsController from './inPrisonCoursesAndQualificationsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../utils/result/result'
import validInPrisonCourseRecords from '../../testsupport/inPrisonCourseRecordsTestDataBuilder'

describe('inPrisonCoursesAndQualificationsController', () => {
  const controller = new InPrisonCoursesAndQualificationsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const prisonNamesById = Result.fulfilled({ MDI: 'Moorland (HMP & YOI)' })
  const curiousInPrisonCourses = Result.fulfilled(validInPrisonCourseRecords())

  const req = {
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, prisonNamesById, curiousInPrisonCourses },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getInPrisonCoursesAndQualificationsViewForPlp', () => {
    it('should get In Prison Courses And Qualifications view for use with PLP', async () => {
      // Given
      const expectedView = {
        prisonerSummary,
        curiousInPrisonCourses,
        prisonNamesById,
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
      const expectedView = {
        prisonerSummary,
        curiousInPrisonCourses,
        prisonNamesById,
      }

      // When
      await controller.getInPrisonCoursesAndQualificationsViewForDps(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/inPrisonCoursesAndQualifications/dpsTemplate', expectedView)
    })
  })
})
