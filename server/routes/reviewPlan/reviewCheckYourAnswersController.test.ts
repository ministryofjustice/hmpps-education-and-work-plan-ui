import { Request, Response } from 'express'
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
  const userName = 'Larry David'

  let req: Request
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    req = {
      params: { prisonNumber },
      session: { previousPageWasReviewCheckYourAnswers: true },
    } as unknown as Request

    res = {
      render: jest.fn(),
      locals: { prisonerSummary, user: { name: userName } },
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

      const expectedViewData = new ReviewCheckYourAnswersView(prisonerSummary, reviewPlanDto, userName).renderArgs

      // When
      await controller.getReviewCheckYourAnswersView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/checkYourAnswers', expectedViewData)
    })
  })
})
