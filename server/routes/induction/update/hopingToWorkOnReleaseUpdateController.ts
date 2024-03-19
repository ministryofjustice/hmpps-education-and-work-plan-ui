import { Request } from 'express'
import HopingToWorkOnReleaseController from '../common/hopingToWorkOnReleaseController'

export default class HopingToWorkOnReleaseUpdateController extends HopingToWorkOnReleaseController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(req: Request): string {
    const { prisonerSummary } = req.session
    return `Back to ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s learning and work progress`
  }
}
