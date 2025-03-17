import { Request, Response } from 'express'
import ReviewCompleteController from './reviewCompleteController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidReviewPlanDto from '../../../testsupport/reviewPlanDtoTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

describe('ReviewCompleteController', () => {
  const controller = new ReviewCompleteController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const reviewPlanDto = aValidReviewPlanDto()

  const req = {
    session: {},
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getReviewCompleteView', () => {
    it('should render the "Review Complete" page', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).reviewPlanDto = reviewPlanDto

      const expectedViewData = {
        prisonerSummary,
        reviewPlanDto,
      }

      // When
      await controller.getReviewCompleteView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/review/reviewComplete/index', expectedViewData)
    })
  })

  describe('goToLearningAndWorkProgressPlan', () => {
    it('should redirect to the overview page when the Go to learning and work plan button is clicked', async () => {
      // When
      await controller.goToLearningAndWorkProgressPlan(req, res, next)

      // Then
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`, 'Review completed.')
    })
  })
})
