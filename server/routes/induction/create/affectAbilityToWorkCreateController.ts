import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import AffectAbilityToWorkController from '../common/affectAbilityToWorkController'
import validateAffectAbilityToWorkForm from '../../validators/induction/affectAbilityToWorkFormValidator'
import { asArray } from '../../../utils/utils'

export default class AffectAbilityToWorkCreateController extends AffectAbilityToWorkController {
  submitAffectAbilityToWorkForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals

    const affectAbilityToWorkForm: AffectAbilityToWorkForm = {
      affectAbilityToWork: asArray(req.body.affectAbilityToWork),
      affectAbilityToWorkOther: req.body.affectAbilityToWorkOther,
    }
    req.session.affectAbilityToWorkForm = affectAbilityToWorkForm

    const errors = validateAffectAbilityToWorkForm(affectAbilityToWorkForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/affect-ability-to-work`,
        errors,
      )
    }

    const updatedInduction = this.updatedInductionDtoWithAffectAbilityToWork(inductionDto, affectAbilityToWorkForm)
    req.journeyData.inductionDto = updatedInduction
    req.session.affectAbilityToWorkForm = undefined

    const nextPage = this.previousPageWasCheckYourAnswers(req)
      ? `/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`
      : `/prisoners/${prisonNumber}/create-induction/${journeyId}/highest-level-of-education`
    return res.redirect(nextPage)
  }
}
