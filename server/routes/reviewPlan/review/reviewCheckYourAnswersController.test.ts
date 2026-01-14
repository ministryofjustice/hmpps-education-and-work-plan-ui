import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import { v4 as uuidV4 } from 'uuid'
import type { ReviewPlanDto } from 'dto'
import ReviewCheckYourAnswersController from './reviewCheckYourAnswersController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'
import AuditService from '../../../services/auditService'
import ReviewService from '../../../services/reviewService'
import aValidCreatedActionPlanReview from '../../../testsupport/createdActionPlanReviewTestDataBuilder'

jest.mock('../../../services/auditService')
jest.mock('../../../services/reviewService')

describe('ReviewCheckYourAnswersController', () => {
  const reviewService = new ReviewService(null, null) as jest.Mocked<ReviewService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ReviewCheckYourAnswersController(reviewService, auditService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const flash = jest.fn()
  const req = {
    params: { prisonNumber, journeyId },
    session: {},
    journeyData: {},
    user: { username: 'a-dps-user' },
    originalUrl: `/plan/${prisonNumber}/${journeyId}/review/check-your-answers`,
    flash,
  } as unknown as Request
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData.reviewPlanDto = undefined
  })

  describe('getReviewCheckYourAnswersView', () => {
    it('should render the "Check Your Answers" page', async () => {
      // Given
      const reviewPlanDto = {
        prisonNumber,
        prisonId: 'BXI',
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: startOfDay('2024-03-09'),
        notes: 'Progress noted in review.',
      }
      req.journeyData.reviewPlanDto = reviewPlanDto

      const expectedViewData = {
        prisonerSummary,
        reviewPlanDto,
      }

      // When
      await controller.getReviewCheckYourAnswersView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/review/checkYourAnswers/index', expectedViewData)
    })
  })

  describe('submitCheckYourAnswers', () => {
    it('should redirect to review complete page given form submitted successfully and this was the prisoners last review before release', async () => {
      // Given
      const reviewPlanDto: ReviewPlanDto = {
        prisonNumber,
        prisonId: 'BXI',
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: startOfDay('2024-03-09'),
        notes: 'Chris has progressed well',
      }
      req.journeyData.reviewPlanDto = reviewPlanDto

      const createdActionPlanReview = aValidCreatedActionPlanReview({ wasLastReviewBeforeRelease: true })
      reviewService.createActionPlanReview.mockResolvedValue(createdActionPlanReview)

      const expectedUpdatedReviewPlanDto: ReviewPlanDto = {
        ...reviewPlanDto,
        wasLastReviewBeforeRelease: true,
        nextReviewDateFrom: undefined,
        nextReviewDateTo: undefined,
      }

      // When
      await controller.submitCheckYourAnswers(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('complete')
      expect(reviewService.createActionPlanReview).toHaveBeenCalledWith(reviewPlanDto, 'a-dps-user')
      expect(req.journeyData.reviewPlanDto).toEqual(expectedUpdatedReviewPlanDto)
      expect(auditService.logCreateActionPlanReview).toHaveBeenCalled()
      expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney', 'true')
    })

    it('should redirect to review complete page given form submitted successfully and this was not the prisoners last review before release', async () => {
      // Given
      const reviewPlanDto: ReviewPlanDto = {
        prisonNumber,
        prisonId: 'BXI',
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: startOfDay('2024-03-09'),
        notes: 'Chris has progressed well',
      }
      req.journeyData.reviewPlanDto = reviewPlanDto

      const createdActionPlanReview = aValidCreatedActionPlanReview({ wasLastReviewBeforeRelease: false })
      reviewService.createActionPlanReview.mockResolvedValue(createdActionPlanReview)

      const expectedUpdatedReviewPlanDto: ReviewPlanDto = {
        ...reviewPlanDto,
        wasLastReviewBeforeRelease: false,
        nextReviewDateFrom: startOfDay('2024-09-15'),
        nextReviewDateTo: startOfDay('2024-10-15'),
      }

      // When
      await controller.submitCheckYourAnswers(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('complete')
      expect(reviewService.createActionPlanReview).toHaveBeenCalledWith(reviewPlanDto, 'a-dps-user')
      expect(req.journeyData.reviewPlanDto).toEqual(expectedUpdatedReviewPlanDto)
      expect(auditService.logCreateActionPlanReview).toHaveBeenCalled()
      expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney', 'true')
    })

    it('should not redirect to review complete page given service throws an error', async () => {
      // Given
      const reviewPlanDto: ReviewPlanDto = {
        prisonNumber,
        prisonId: 'BXI',
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: startOfDay('2024-03-09'),
        notes: 'Chris has progressed well',
      }
      req.journeyData.reviewPlanDto = reviewPlanDto

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      reviewService.createActionPlanReview.mockRejectedValue(apiErrorResponse)

      // When
      await controller.submitCheckYourAnswers(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('check-your-answers')
      expect(reviewService.createActionPlanReview).toHaveBeenCalledWith(reviewPlanDto, 'a-dps-user')
      expect(req.journeyData.reviewPlanDto).toEqual(reviewPlanDto)
      expect(auditService.logCreateActionPlanReview).not.toHaveBeenCalled()
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    })
  })
})
