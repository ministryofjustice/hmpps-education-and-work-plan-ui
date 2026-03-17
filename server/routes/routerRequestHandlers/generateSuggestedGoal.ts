import { NextFunction, Request, RequestHandler, Response } from 'express'
import { AiGoalService } from '../../services'
import { Result } from '../../utils/result/result'

const generateSuggestedGoal = (aiGoalService: AiGoalService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    const { apiErrorCallback } = res.locals
    res.locals.suggestedGoal = await Result.wrap(
      aiGoalService.generateSuggestedGoal(prisonNumber, req.user.username),
      apiErrorCallback,
    )

    return next()
  }
}
export default generateSuggestedGoal
