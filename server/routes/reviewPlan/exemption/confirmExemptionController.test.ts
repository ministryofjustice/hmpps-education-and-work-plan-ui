import createError from 'http-errors'
import { Request, Response } from 'express'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
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

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

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
      locals: { prisonerSummary },
    } as unknown as Response

    getPrisonerContext(req.session, prisonNumber).reviewExemptionDto = undefined

    jest.clearAllMocks()
  })

  describe('getConfirmExemptionView', () => {
    it('should render the "Are you sure you want to put review on hold" page', async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto()
      getPrisonerContext(req.session, prisonNumber).reviewExemptionDto = reviewExemptionDto

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
      getPrisonerContext(req.session, prisonNumber).reviewExemptionDto = reviewExemptionDto

      reviewService.updateActionPlanReviewScheduleStatus.mockResolvedValue(undefined)

      // When
      await controller.submitConfirmExemption(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/review/exemption/recorded')
      expect(reviewService.updateActionPlanReviewScheduleStatus).toHaveBeenCalledWith(reviewExemptionDto, 'a-dps-user')
      expect(getPrisonerContext(req.session, prisonNumber).reviewExemptionDto).toEqual(reviewExemptionDto)
      expect(auditService.logExemptActionPlanReview).toHaveBeenCalled()
    })

    it('should not redirect to review complete page given service throws an error', async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto()
      getPrisonerContext(req.session, prisonNumber).reviewExemptionDto = reviewExemptionDto

      reviewService.updateActionPlanReviewScheduleStatus.mockRejectedValue(new Error('Service failure'))

      // When
      await controller.submitConfirmExemption(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith(createError(500, 'Error exempting Action Plan Review for prisoner A1234BC'))
      expect(reviewService.updateActionPlanReviewScheduleStatus).toHaveBeenCalledWith(reviewExemptionDto, 'a-dps-user')
      expect(getPrisonerContext(req.session, prisonNumber).reviewExemptionDto).toEqual(reviewExemptionDto)
      expect(auditService.logExemptActionPlanReview).not.toHaveBeenCalled()
    })
  })
})
