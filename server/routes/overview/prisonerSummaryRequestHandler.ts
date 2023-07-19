import type { PrisonerSummary } from 'viewModels'
import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import PrisonerSearchService from '../../services/prisonerSearchService'

/**
 * Class exposing middleware functions related to ensuring we have the correct PrisonerSummary in session.
 */
export default class PrisonerSummaryRequestHandler {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  /**
   *  Middleware function to look up the prisoner from prisoner-search, map to a PrisonerSummary, and store in the session
   */
  getPrisonerSummary: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      // Lookup the prisoner and store in the session if its either not there, or is for a different prisoner
      if (!req.session.prisonerSummary || req.session.prisonerSummary.prisonNumber !== prisonNumber) {
        const prisoner = await this.prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, req.user.username)
        req.session.prisonerSummary = {
          prisonNumber: prisoner.prisonerNumber,
          releaseDate: prisoner.releaseDate,
          location: prisoner.cellLocation,
          firstName: prisoner.firstName,
          lastName: prisoner.lastName,
        } as PrisonerSummary
      }
      next()
    } catch (error) {
      next(createError(404, 'Prisoner not found'))
    }
  }
}
