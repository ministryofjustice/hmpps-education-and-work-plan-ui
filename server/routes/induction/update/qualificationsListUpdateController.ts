import { Request } from 'express'
import QualificationsListController from '../common/qualificationsListController'

export default class QualificationsListUpdateController extends QualificationsListController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/education-and-training`
  }

  getBackLinkAriaText(_req: Request): string {
    return 'Back to <TODO - check what CIAG UI does here>'
  }
}
