import { Request, Response } from 'express'
import ReviewCompleteController from './reviewCompleteController'
import ReviewCompleteView from './reviewCompleteView'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../../data/session/prisonerContexts')

describe('ReviewCompleteController', () => {
  const controller = new ReviewCompleteController()

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

    next = jest.fn()

    jest.clearAllMocks()
  })

  describe('getReviewCompleteView', () => {
    it('should render the "Review Complete" page', async () => {
      // Given
      const expectedViewData = new ReviewCompleteView(prisonerSummary).renderArgs

      // When
      await controller.getReviewCompleteView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/reviewComplete/index', expectedViewData)
    })
  })

  describe('goToLearningAndWorkProgressPlan', () => {
    it('should redirect to the overview page when the Go to learning and work progress plan button is clicked', async () => {
      // When
      await controller.goToLearningAndWorkProgressPlan(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/overview`)
    })
  })
})
