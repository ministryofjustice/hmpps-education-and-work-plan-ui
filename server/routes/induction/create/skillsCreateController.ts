import { Request } from 'express'
import SkillsController from '../common/skillsController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

export default class SkillsCreateController extends SkillsController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-induction/work-interest-roles`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }
}
