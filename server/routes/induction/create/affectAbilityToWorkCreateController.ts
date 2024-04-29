import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import AffectAbilityToWorkController from '../common/affectAbilityToWorkController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateAffectAbilityToWorkForm from '../../validators/induction/affectAbilityToWorkFormValidator'
import { asArray } from '../../../utils/utils'
import { getPreviousPage } from '../../pageFlowHistory'

export default class AffectAbilityToWorkCreateController extends AffectAbilityToWorkController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/prisoners/${prisonNumber}/create-induction/personal-interests`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitAffectAbilityToWorkForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    const affectAbilityToWorkForm: AffectAbilityToWorkForm = {
      affectAbilityToWork: asArray(req.body.affectAbilityToWork),
      affectAbilityToWorkOther: req.body.affectAbilityToWorkOther,
    }
    req.session.affectAbilityToWorkForm = affectAbilityToWorkForm

    const errors = validateAffectAbilityToWorkForm(affectAbilityToWorkForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/affect-ability-to-work`)
    }

    const updatedInduction = this.updatedInductionDtoWithAffectAbilityToWork(inductionDto, affectAbilityToWorkForm)
    req.session.inductionDto = updatedInduction
    req.session.affectAbilityToWorkForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
  }
}
