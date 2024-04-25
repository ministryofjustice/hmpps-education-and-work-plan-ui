import { Request } from 'express'
import WorkInterestTypesController from '../common/workInterestTypesController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

export default class WorkInterestTypesCreateController extends WorkInterestTypesController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-induction/has-worked-before`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }
}
