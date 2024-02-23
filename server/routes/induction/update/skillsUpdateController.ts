import { NextFunction, Request, RequestHandler, Response } from 'express'
import SkillsController from '../common/skillsController'

/**
 * Controller for the Update of the Skills screen of the Induction.
 */
export default class SkillsUpdateController extends SkillsController {
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

  submitSkillsForm: RequestHandler = async (_req: Request, _res: Response, _next: NextFunction): Promise<void> => {}
}
