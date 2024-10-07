import { NextFunction, Request, Response } from 'express'
import type { ReviewPlanDto } from 'dto'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

/**
 * Request handler function to check whether a Review Plan DTO exists in the prisoner context for the prisoner referenced
 * in the request URL.
 * If one does not exist create a new empty Review Plan DTO for the prisoner.
 */
const createEmptyReviewPlanDtoIfNotInPrisonerContext = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params

  if (!getPrisonerContext(req.session, prisonNumber).reviewPlanDto) {
    getPrisonerContext(req.session, prisonNumber).reviewPlanDto = {} as ReviewPlanDto
  }

  next()
}

export default createEmptyReviewPlanDtoIfNotInPrisonerContext
