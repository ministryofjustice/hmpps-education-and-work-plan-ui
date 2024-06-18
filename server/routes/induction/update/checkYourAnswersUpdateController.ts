import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import CheckYourAnswersController from '../common/checkYourAnswersController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'

/**
 * Controller for the Check Your Answers screen after updating an Induction.
 */
export default class CheckYourAnswersUpdateController extends CheckYourAnswersController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(_req: Request): string {
    // Default implementation - the back link is not displayed on the Check Your Answers page
    return undefined
  }

  getBackLinkAriaText(_req: Request): string {
    // Default implementation - the back link is not displayed on the Check Your Answers page
    return undefined
  }

  submitCheckYourAnswers: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, inductionDto)

    try {
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.pageFlowHistory = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
