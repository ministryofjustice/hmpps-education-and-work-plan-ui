import { Request } from 'express'
import CheckYourAnswersController from '../common/checkYourAnswersController'

export default class CheckYourAnswersCreateController extends CheckYourAnswersController {
  getBackLinkUrl(_req: Request): string {
    // Default implementation - the back link is not displayed on the Check Your Answers page
    return undefined
  }

  getBackLinkAriaText(_req: Request): string {
    // Default implementation - the back link is not displayed on the Check Your Answers page
    return undefined
  }
}
