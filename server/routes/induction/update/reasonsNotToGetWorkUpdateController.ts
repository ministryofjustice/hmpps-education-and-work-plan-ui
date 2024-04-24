import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import ReasonsNotToGetWorkController from '../common/reasonsNotToGetWorkController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateReasonsNotToGetWorkForm from '../../validators/induction/reasonsNotToGetWorkFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

/**
 * Controller for Updating a Prisoner's Reasons Not To Get Work after release screen of the Induction.
 */
export default class ReasonsNotToGetWorkUpdateController extends ReasonsNotToGetWorkController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitReasonsNotToGetWorkForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.reasonsNotToGetWorkForm = { ...req.body }
    if (!req.session.reasonsNotToGetWorkForm.reasonsNotToGetWork) {
      req.session.reasonsNotToGetWorkForm.reasonsNotToGetWork = []
    }
    if (!Array.isArray(req.session.reasonsNotToGetWorkForm.reasonsNotToGetWork)) {
      req.session.reasonsNotToGetWorkForm.reasonsNotToGetWork = [
        req.session.reasonsNotToGetWorkForm.reasonsNotToGetWork,
      ]
    }
    const { reasonsNotToGetWorkForm } = req.session

    const errors = validateReasonsNotToGetWorkForm(reasonsNotToGetWorkForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`)
    }

    const updatedInduction = this.updatedInductionDtoWithReasonsNotToGetWork(inductionDto, reasonsNotToGetWorkForm)
    req.session.inductionDto = updatedInduction

    // If the previous page was Check Your Answers, forward to Check Your Answers again
    if (this.previousPageWasCheckYourAnswers(req)) {
      req.session.reasonsNotToGetWorkForm = undefined
      return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
    }

    // Check if we are in the midst of changing the main induction question set from long route to short route
    if (req.session.updateInductionQuestionSet) {
      req.session.reasonsNotToGetWorkForm = undefined
      const nextPage =
        inductionDto.previousQualifications?.qualifications?.length > 0
          ? `/prisoners/${prisonNumber}/induction/qualifications`
          : `/prisoners/${prisonNumber}/induction/want-to-add-qualifications`
      return res.redirect(nextPage)
    }

    // Otherwise update the Induction in the API and return to the main work-and-interests tab
    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.reasonsNotToGetWorkForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
