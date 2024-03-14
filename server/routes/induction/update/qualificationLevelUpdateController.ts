import { Request } from 'express'
import { InductionService } from '../../../services'
import QualificationLevelController from '../common/qualificationLevelController'

/**
 * Controller for the Update of the Qualification Level screen of the Induction.
 */
export default class QualificationLevelUpdateController extends QualificationLevelController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/education-and-training`
  }

  getBackLinkAriaText(_req: Request): string {
    return 'Back to <TODO - check what CIAG UI does here>'
  }
}
