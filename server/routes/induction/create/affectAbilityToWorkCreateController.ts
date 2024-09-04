import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import AffectAbilityToWorkController from '../common/affectAbilityToWorkController'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import validateAffectAbilityToWorkForm from '../../validators/induction/affectAbilityToWorkFormValidator'
import { asArray } from '../../../utils/utils'
import { getPreviousPage } from '../../pageFlowHistory'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

export default class AffectAbilityToWorkCreateController extends AffectAbilityToWorkController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory, inductionDto } = req.session
    let previousPage = pageFlowHistory && getPreviousPage(pageFlowHistory)
    if (!previousPage) {
      // No previous page from the Page Flow History
      // The previous page in this case is based on whether the prisoner hopes to work or not
      previousPage =
        inductionDto.workOnRelease.hopingToWork === HopingToGetWorkValue.YES
          ? `/prisoners/${prisonNumber}/create-induction/work-interest-roles`
          : `/prisoners/${prisonNumber}/create-induction/hoping-to-work-on-release`
    }
    return previousPage
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
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/affect-ability-to-work`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithAffectAbilityToWork(inductionDto, affectAbilityToWorkForm)
    req.session.inductionDto = updatedInduction
    req.session.affectAbilityToWorkForm = undefined

    const nextPage = this.previousPageWasCheckYourAnswers(req)
      ? `/prisoners/${prisonNumber}/create-induction/check-your-answers`
      : `/prisoners/${prisonNumber}/create-induction/highest-level-of-education`
    return res.redirect(nextPage)
  }
}
