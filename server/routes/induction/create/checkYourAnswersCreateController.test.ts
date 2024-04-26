import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import CheckYourAnswersCreateController from './checkYourAnswersCreateController'

describe('checkYourAnswersCreateController', () => {
  const controller = new CheckYourAnswersCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {} as SessionData,
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = { prisonerSummary } as SessionData
    req.user = { token: 'some-token' } as Express.User
    req.params = { prisonNumber }
  })

  describe('getCheckYourAnswersView', () => {
    it('should get the Check Your Answers view', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      // When
      const expectedView = { prisonerSummary, inductionDto }

      // When
      await controller.getCheckYourAnswersView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/checkYourAnswers/index', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
