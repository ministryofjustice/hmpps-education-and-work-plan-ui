import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import createError from 'http-errors'
import { v4 as uuidV4 } from 'uuid'
import type { ReviewPlanDto } from 'dto'
import ReviewCheckYourAnswersController from './reviewCheckYourAnswersController'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'
import AuditService from '../../../services/auditService'
import ReviewService from '../../../services/reviewService'
import aValidCreatedActionPlanReview from '../../../testsupport/createdActionPlanReviewTestDataBuilder'

jest.mock('../../../services/auditService')
jest.mock('../../../services/reviewService')

describe('ReviewCheckYourAnswersController', () => {
  const reviewService = new ReviewService(null, null, null) as jest.Mocked<ReviewService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ReviewCheckYourAnswersController(reviewService, auditService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    req = {
      params: { prisonNumber, journeyId },
      session: {},
      user: { username: 'a-dps-user' },
      originalUrl: `/plan/${prisonNumber}/${journeyId}/review/check-your-answers`,
    } as unknown as Request

    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      locals: { prisonerSummary },
    } as unknown as Response

    getPrisonerContext(req.session, prisonNumber).reviewPlanDto = undefined

    jest.clearAllMocks()
  })

  describe('getReviewCheckYourAnswersView', () => {
    it('should render the "Check Your Answers" page', async () => {
      // Given
      req.session.pageFlowHistory = undefined
      const reviewPlanDto = {
        prisonNumber,
        prisonId: 'BXI',
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: startOfDay('2024-03-09'),
        notes: 'Progress noted in review.',
      }
      getPrisonerContext(req.session, prisonNumber).reviewPlanDto = reviewPlanDto

      const expectedViewData = {
        prisonerSummary,
        reviewPlanDto,
      }
      const expectedPageFlowHistory = {
        currentPageIndex: 0,
        pageUrls: [`/plan/${prisonNumber}/${journeyId}/review/check-your-answers`],
      }

      // When
      await controller.getReviewCheckYourAnswersView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/review/checkYourAnswers/index', expectedViewData)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
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
      getPrisonerContext(req.session, prisonNumber).reviewPlanDto = reviewPlanDto

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
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/${journeyId}/review/complete`)
      expect(reviewService.createActionPlanReview).toHaveBeenCalledWith(reviewPlanDto, 'a-dps-user')
      expect(getPrisonerContext(req.session, prisonNumber).reviewPlanDto).toEqual(expectedUpdatedReviewPlanDto)
      expect(auditService.logCreateActionPlanReview).toHaveBeenCalled()
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
      getPrisonerContext(req.session, prisonNumber).reviewPlanDto = reviewPlanDto

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
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/${journeyId}/review/complete`)
      expect(reviewService.createActionPlanReview).toHaveBeenCalledWith(reviewPlanDto, 'a-dps-user')
      expect(getPrisonerContext(req.session, prisonNumber).reviewPlanDto).toEqual(expectedUpdatedReviewPlanDto)
      expect(auditService.logCreateActionPlanReview).toHaveBeenCalled()
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
      getPrisonerContext(req.session, prisonNumber).reviewPlanDto = reviewPlanDto

      reviewService.createActionPlanReview.mockRejectedValue(new Error('Service failure'))

      // When
      await controller.submitCheckYourAnswers(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith(createError(500, 'Error creating Action Plan Review for prisoner A1234BC'))
      expect(reviewService.createActionPlanReview).toHaveBeenCalledWith(reviewPlanDto, 'a-dps-user')
      expect(getPrisonerContext(req.session, prisonNumber).reviewPlanDto).toEqual(reviewPlanDto)
      expect(auditService.logCreateActionPlanReview).not.toHaveBeenCalled()
    })
  })
})
