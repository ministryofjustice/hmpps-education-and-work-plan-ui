import createError from 'http-errors'
import { v4 as uuidV4 } from 'uuid'
import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import ConfirmExemptionController from './confirmExemptionController'
import aValidReviewExemptionDto from '../../../testsupport/reviewExemptionDtoTestDataBuilder'
import ReviewService from '../../../services/reviewService'
import AuditService from '../../../services/auditService'

jest.mock('../../../services/auditService')
jest.mock('../../../services/reviewService')

describe('ConfirmExemptionController', () => {
  const reviewService = new ReviewService(null, null, null) as jest.Mocked<ReviewService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ConfirmExemptionController(reviewService, auditService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    req = {
      user: { username: 'a-dps-user' },
      params: { prisonNumber, journeyId },
      journeyData: {},
    } as unknown as Request
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      locals: { prisonerSummary },
    } as unknown as Response

    req.journeyData.reviewExemptionDto = undefined

    jest.clearAllMocks()
  })

  describe('getConfirmExemptionView', () => {
    it('should render the "Are you sure you want to put review on hold" page', async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto()
      req.journeyData.reviewExemptionDto = reviewExemptionDto

      const expectedViewData = { prisonerSummary, reviewExemptionDto }

      // When
      await controller.getConfirmExemptionView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/exemption/confirmExemption/index', expectedViewData)
    })
  })

  describe('submitConfirmException', () => {
    it(`should redirect to 'Exemption recorded' page given successful service call`, async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto()
      req.journeyData.reviewExemptionDto = reviewExemptionDto

      reviewService.updateActionPlanReviewScheduleStatus.mockResolvedValue(undefined)

      // When
      await controller.submitConfirmExemption(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/${journeyId}/review/exemption/recorded`)
      expect(reviewService.updateActionPlanReviewScheduleStatus).toHaveBeenCalledWith(reviewExemptionDto, 'a-dps-user')
      expect(req.journeyData.reviewExemptionDto).toEqual(reviewExemptionDto)
      expect(auditService.logExemptActionPlanReview).toHaveBeenCalled()
    })

    it('should not redirect to review complete page given service throws an error', async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto()
      req.journeyData.reviewExemptionDto = reviewExemptionDto

      reviewService.updateActionPlanReviewScheduleStatus.mockRejectedValue(new Error('Service failure'))

      // When
      await controller.submitConfirmExemption(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith(createError(500, 'Error exempting Action Plan Review for prisoner A1234BC'))
      expect(reviewService.updateActionPlanReviewScheduleStatus).toHaveBeenCalledWith(reviewExemptionDto, 'a-dps-user')
      expect(req.journeyData.reviewExemptionDto).toEqual(reviewExemptionDto)
      expect(auditService.logExemptActionPlanReview).not.toHaveBeenCalled()
    })
  })
})
