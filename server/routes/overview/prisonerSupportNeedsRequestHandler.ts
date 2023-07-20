import { NextFunction, Request, RequestHandler, Response } from 'express'
import { CuriousService } from '../../services'

/**
 * Class exposing middleware functions related to ensuring we have a prisoner's support needs.
 */
export default class PrisonerSupportNeedsRequestHandler {
  constructor(private readonly curiousService: CuriousService) {}

  /**
   *  Middleware function to look up the prisoner's Support Needs, and store them in the session
   */
  getPrisonerSupportNeeds: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      if (!req.session.supportNeeds) {
        req.session.supportNeeds = await this.curiousService.getPrisonerSupportNeeds(prisonNumber, req.user.username)
      }
    } catch (error) {
      req.session.supportNeeds = {
        healthAndSupportNeeds: undefined,
        neurodiversities: undefined,
        problemRetrievingData: true,
      }
    }
    next()
  }
}
