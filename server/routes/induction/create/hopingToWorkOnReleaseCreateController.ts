import { Request } from 'express'
import HopingToWorkOnReleaseController from '../common/hopingToWorkOnReleaseController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

export default class HopingToWorkOnReleaseCreateController extends HopingToWorkOnReleaseController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/overview`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }
}
