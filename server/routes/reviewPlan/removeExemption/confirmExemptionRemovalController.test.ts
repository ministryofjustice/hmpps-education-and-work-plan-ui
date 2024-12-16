import { Request, Response } from 'express'
import createError from 'http-errors'
import ReviewService from '../../../services/reviewService'
import AuditService from '../../../services/auditService'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import ConfirmExemptionRemovalController from './confirmExemptionRemovalController'
import aValidActionPlanReviews from '../../../testsupport/actionPlanReviewsTestDataBuilder'
import aValidScheduledActionPlanReview from '../../../testsupport/scheduledActionPlanReviewTestDataBuilder'
import ActionPlanReviewStatusValue from '../../../enums/actionPlanReviewStatusValue'
import ReviewScheduleStatusValue from '../../../enums/reviewScheduleStatusValue'

jest.mock('../../../services/auditService')
jest.mock('../../../services/reviewService')

describe('confirmExemptionRemovalController', () => {
  const reviewService = new ReviewService(null, null, null) as jest.Mocked<ReviewService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ConfirmExemptionRemovalController(reviewService, auditService)

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)
  const actionPlanReviews = aValidActionPlanReviews({
    latestReviewSchedule: aValidScheduledActionPlanReview({
      status: ActionPlanReviewStatusValue.EXEMPT_PRISON_STAFF_REDEPLOYMENT,
    }),
  })

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    req = {
      user: { username: 'a-dps-user' },
      params: { prisonNumber },
      session: {},
    } as unknown as Request
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      locals: { prisonerSummary, actionPlanReviews },
    } as unknown as Response

    jest.clearAllMocks()
  })

  describe('getConfirmExemptionRemovalView', () => {
    it('should render the "Are you sure you want to remove the exemption" page', async () => {
      // Given
      const expectedViewData = {
        prisonerSummary,
        exemptionReason: ActionPlanReviewStatusValue.EXEMPT_PRISON_STAFF_REDEPLOYMENT,
      }

      // When
      await controller.getConfirmExemptionRemovalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/removeExemption/confirmRemoval/index', expectedViewData)
    })
  })

  describe('submitConfirmExemptionRemoval', () => {
    it(`should redirect to 'Exemption Removed' page given successful service call`, async () => {
      // Given
      reviewService.updateActionPlanReviewScheduleStatus.mockResolvedValue(undefined)

      const expectedDtp = {
        prisonNumber,
        prisonId: 'BXI',
        exemptionReason: ReviewScheduleStatusValue.SCHEDULED,
        exemptionReasonDetails: undefined as string,
      }

      // When
      await controller.submitConfirmExemptionRemoval(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/review/exemption/removed')
      expect(reviewService.updateActionPlanReviewScheduleStatus).toHaveBeenCalledWith(expectedDtp, 'a-dps-user')
      expect(auditService.logRemoveExemptionActionPlanReview).toHaveBeenCalled()
    })

    it('should not redirect to Exemption Removed page given service throws an error', async () => {
      // Given
      reviewService.updateActionPlanReviewScheduleStatus.mockRejectedValue(new Error('Service failure'))

      const expectedDtp = {
        prisonNumber,
        prisonId: 'BXI',
        exemptionReason: ReviewScheduleStatusValue.SCHEDULED,
        exemptionReasonDetails: undefined as string,
      }

      // When
      await controller.submitConfirmExemptionRemoval(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith(
        createError(500, 'Error removing exemption for Action Plan Review for prisoner A1234BC'),
      )
      expect(reviewService.updateActionPlanReviewScheduleStatus).toHaveBeenCalledWith(expectedDtp, 'a-dps-user')
      expect(auditService.logExemptActionPlanReview).not.toHaveBeenCalled()
    })
  })
})
