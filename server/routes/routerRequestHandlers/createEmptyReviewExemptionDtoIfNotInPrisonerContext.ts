import { NextFunction, Request, Response } from 'express'
import type { ReviewExemptionDto } from 'dto'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

/**
 * Request handler function to check whether a Review Exemption DTO exists in the prisoner context for the prisoner referenced
 * in the request URL.
 * If one does not exist create a new empty Review Exemption DTO for the prisoner.
 */
const createEmptyReviewExemptionDtoIfNotInPrisonerContext = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params

  if (!getPrisonerContext(req.session, prisonNumber).reviewExemptionDto) {
    getPrisonerContext(req.session, prisonNumber).reviewExemptionDto = {} as ReviewExemptionDto
  }

  next()
}

export default createEmptyReviewExemptionDtoIfNotInPrisonerContext
