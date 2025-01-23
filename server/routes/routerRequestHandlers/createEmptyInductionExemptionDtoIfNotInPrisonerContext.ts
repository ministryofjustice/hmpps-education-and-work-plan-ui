import { NextFunction, Request, Response } from 'express'
import type { InductionExemptionDto } from 'inductionDto'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

/**
 * Request handler function to check whether an Induction Exemption DTO exists in the prisoner context for the prisoner referenced
 * in the request URL.
 * If one does not exist create a new empty Induction Exemption DTO for the prisoner.
 */
const createEmptyInductionExemptionDtoIfNotInPrisonerContext = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { prisonNumber } = req.params

  if (!getPrisonerContext(req.session, prisonNumber).inductionExemptionDto) {
    getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = { prisonNumber } as InductionExemptionDto
  }

  next()
}

export default createEmptyInductionExemptionDtoIfNotInPrisonerContext
