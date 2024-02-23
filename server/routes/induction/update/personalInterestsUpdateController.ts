import { NextFunction, Request, RequestHandler, Response } from 'express'
import PersonalInterestsController from '../common/personalInterestsController'

/**
 * Controller for the Update of the Personal Interests screen of the Induction.
 */
export default class PersonalInterestsUpdateController extends PersonalInterestsController {
  constructor() {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(_req: Request): string {
    return 'Back to <TODO - check what CIAG UI does here>'
  }

  submitPersonalInterestsForm: RequestHandler = async (
    _req: Request,
    _res: Response,
    _next: NextFunction,
  ): Promise<void> => {}
}
