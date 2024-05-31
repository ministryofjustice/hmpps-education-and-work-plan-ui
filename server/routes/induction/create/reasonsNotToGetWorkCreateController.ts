import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ReasonsNotToGetWorkForm } from 'inductionForms'
import ReasonsNotToGetWorkController from '../common/reasonsNotToGetWorkController'
import validateReasonsNotToGetWorkForm from '../../validators/induction/reasonsNotToGetWorkFormValidator'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import { asArray } from '../../../utils/utils'
import { getPreviousPage } from '../../pageFlowHistory'

/**
 * Controller for Reasons Not To Get Work after release screen of the create induction journey.
 */
export default class ReasonsNotToGetWorkCreateController extends ReasonsNotToGetWorkController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) ||
      `/prisoners/${prisonNumber}/create-induction/hoping-to-work-on-release`
    return previousPage
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

    const reasonsNotToGetWorkForm: ReasonsNotToGetWorkForm = {
      reasonsNotToGetWork: asArray(req.body.reasonsNotToGetWork),
      reasonsNotToGetWorkOther: req.body.reasonsNotToGetWorkOther,
    }
    req.session.reasonsNotToGetWorkForm = reasonsNotToGetWorkForm

    const errors = validateReasonsNotToGetWorkForm(reasonsNotToGetWorkForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/reasons-not-to-get-work`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithReasonsNotToGetWork(inductionDto, reasonsNotToGetWorkForm)
    req.session.inductionDto = updatedInduction
    req.session.reasonsNotToGetWorkForm = undefined

    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    // If there are already qualifications on the Induction (in the case the user has navigated back or is changing from
    // a long to short question set via Check Your Answers) we don't need to ask if the user wants to add qualifications
    // and instead can simply show them on the Qualifications list page.
    return updatedInduction.previousQualifications?.qualifications?.length > 0
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/qualifications`)
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`)
  }
}
