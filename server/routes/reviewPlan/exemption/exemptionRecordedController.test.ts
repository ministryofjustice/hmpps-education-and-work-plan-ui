import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import ExemptionRecordedController from './exemptionRecordedController'
import aValidReviewExemptionDto from '../../../testsupport/reviewExemptionDtoTestDataBuilder'
import ReviewScheduleStatusValue from '../../../enums/reviewScheduleStatusValue'
import aValidActionPlanReviews from '../../../testsupport/actionPlanReviewsTestDataBuilder'
import aValidScheduledActionPlanReview from '../../../testsupport/scheduledActionPlanReviewTestDataBuilder'

describe('ExemptionRecordedController', () => {
  const controller = new ExemptionRecordedController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const actionPlanReviews = aValidActionPlanReviews({
    latestReviewSchedule: aValidScheduledActionPlanReview({ reviewDateTo: startOfDay('2024-12-03') }),
  })

  let req: Request
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    req = {
      params: { prisonNumber },
      journeyData: {},
    } as unknown as Request

    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      redirectWithSuccess: jest.fn(),
      locals: { prisonerSummary, actionPlanReviews },
    } as unknown as Response

    next = jest.fn()

    jest.clearAllMocks()
  })

  describe('getExemptionRecordedView', () => {
    it('should render the "Exemption Recorded" page given the exemption reason is not system technical issue', async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto({
        exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
      })
      req.journeyData.reviewExemptionDto = reviewExemptionDto

      const expectedViewData = {
        prisonerSummary,
        nextReviewDate: startOfDay('2024-12-03'),
        exemptionDueToTechnicalIssue: false,
      }

      // When
      await controller.getExemptionRecordedView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/exemption/exemptionRecorded/index', expectedViewData)
    })

    it('should render the "Exemption Recorded" page given the exemption reason is system technical issue', async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto({
        exemptionReason: ReviewScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
      })
      req.journeyData.reviewExemptionDto = reviewExemptionDto

      const expectedViewData = {
        prisonerSummary,
        nextReviewDate: startOfDay('2024-12-03'),
        exemptionDueToTechnicalIssue: true,
      }

      // When
      await controller.getExemptionRecordedView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/exemption/exemptionRecorded/index', expectedViewData)
    })
  })

  describe('submitExemptionRecorded', () => {
    it('should redirect to the overview page with a success message given the exemption reason was not system issue', async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto({
        exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE,
      })
      req.journeyData.reviewExemptionDto = reviewExemptionDto

      // When
      await controller.submitExemptionRecorded(req, res, next)

      // Then
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(
        `/plan/${prisonNumber}/view/overview`,
        'Exemption recorded. <b>You must remove this exemption when the reason no longer applies.</b>',
      )
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('should redirect to the overview page with a success message given the exemption reason was system issue', async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto({
        exemptionReason: ReviewScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
      })
      req.journeyData.reviewExemptionDto = reviewExemptionDto

      // When
      await controller.submitExemptionRecorded(req, res, next)

      // Then
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`, 'Exemption recorded.')
      expect(res.redirect).not.toHaveBeenCalled()
    })
  })
})
