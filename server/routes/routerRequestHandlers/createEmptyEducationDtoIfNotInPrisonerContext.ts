import { NextFunction, Request, Response } from 'express'
import type { EducationDto } from 'dto'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

/**
 * Request handler function to check whether an Education DTO exists in the prisoner context for the prisoner referenced
 * in the request URL.
 * If one does not exist create a new empty Education DTO for the prisoner.
 */
const createEmptyEducationDtoIfNotInPrisonerContext = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params

  if (!getPrisonerContext(req.session, prisonNumber).educationDto) {
    getPrisonerContext(req.session, prisonNumber).educationDto = { prisonNumber, qualifications: [] } as EducationDto
  }

  next()
}

export default createEmptyEducationDtoIfNotInPrisonerContext
