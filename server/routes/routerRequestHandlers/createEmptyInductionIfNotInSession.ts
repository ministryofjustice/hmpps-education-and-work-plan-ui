import { NextFunction, Request, Response } from 'express'
import type { InductionDto } from 'inductionDto'

/**
 * Request handler function to check whether an Induction exists in the session for the prisoner referenced in the
 * request URL.
 * If one does not exist, or it is for a different prisoner, create a new empty Induction for the prisoner.
 */
const createEmptyInductionIfNotInSession = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params

  // Either no Induction on the session, or it's for a different prisoner. Create a new one
  if (req.session.inductionDto?.prisonNumber !== prisonNumber) {
    req.session.inductionDto = { prisonNumber } as InductionDto
  }

  next()
}

export default createEmptyInductionIfNotInSession
