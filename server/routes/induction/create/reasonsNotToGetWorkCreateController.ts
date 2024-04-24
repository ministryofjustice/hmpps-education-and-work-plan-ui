import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ReasonsNotToGetWorkForm } from 'inductionForms'
import ReasonsNotToGetWorkController from '../common/reasonsNotToGetWorkController'
import validateReasonsNotToGetWorkForm from '../../validators/induction/reasonsNotToGetWorkFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import { asArray } from '../../../utils/utils'

/**
 * Controller for Reasons Not To Get Work after release screen of the create induction journey.
 */
export default class ReasonsNotToGetWorkCreateController extends ReasonsNotToGetWorkController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      const previousPage = getPreviousPage(pageFlowHistory)
      if (previousPage) return previousPage
    }
    return `/prisoners/${prisonNumber}/create-induction/hoping-to-work-on-release`
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
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/reasons-not-to-get-work`)
    }

    req.session.inductionDto = this.updatedInductionDtoWithReasonsNotToGetWork(inductionDto, reasonsNotToGetWorkForm)
    req.session.reasonsNotToGetWorkForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`)
  }
}
