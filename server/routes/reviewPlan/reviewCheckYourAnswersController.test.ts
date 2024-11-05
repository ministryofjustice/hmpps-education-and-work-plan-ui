import { Request, Response } from 'express'
import type { ReviewPlanDto } from 'dto'
import ReviewCheckYourAnswersController from './reviewCheckYourAnswersController'
import ReviewCheckYourAnswersView from './reviewCheckYourAnswersView'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ReviewPlanCompletedByValue from '../../enums/reviewPlanCompletedByValue'

jest.mock('../pageFlowHistory', () => ({
  addCurrentPageToHistory: jest.fn(),
}))

describe('ReviewCheckYourAnswersController', () => {
  const controller = new ReviewCheckYourAnswersController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  let req: Request
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    req = {
      params: { prisonNumber },
      session: {},
    } as unknown as Request

    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      locals: { prisonerSummary },
    } as unknown as Response

    jest.clearAllMocks()
  })

  describe('getReviewCheckYourAnswersView', () => {
    it('should render the "Check Your Answers" page', async () => {
      // Given
      const reviewPlanDto = {
        completedBy: ReviewPlanCompletedByValue.MYSELF,
        reviewDate: '2024-03-09',
        notes: 'Progress noted in review.',
      }
      getPrisonerContext(req.session, prisonNumber).reviewPlanDto = reviewPlanDto

      const expectedViewData = new ReviewCheckYourAnswersView(prisonerSummary, reviewPlanDto).renderArgs

      // When
      await controller.getReviewCheckYourAnswersView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/checkYourAnswers/index', expectedViewData)
    })
  })

  describe('submitCheckYourAnswers', () => {
    it('should redirect to review complete page given form submitted successfully', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).reviewPlanDto = undefined

      const reviewPlanDto: ReviewPlanDto = {
        completedBy: ReviewPlanCompletedByValue.MYSELF,
        reviewDate: '2024-03-09',
        notes: 'Chris has progressed well',
      }
      getPrisonerContext(req.session, prisonNumber).reviewPlanDto = reviewPlanDto

      // When
      await controller.submitCheckYourAnswers(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/review/complete')
      expect(getPrisonerContext(req.session, prisonNumber).reviewPlanDto).toEqual(reviewPlanDto)
    })
  })
})
