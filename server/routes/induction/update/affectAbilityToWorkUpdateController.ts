import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import AffectAbilityToWorkController from '../common/affectAbilityToWorkController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateAffectAbilityToWorkForm from '../../validators/induction/affectAbilityToWorkFormValidator'
import { asArray } from '../../../utils/utils'

/**
 * Controller for the Update of the Factors Affecting a Prisoner's Ability To Work screen of the Induction.
 */
export default class AffectAbilityToWorkUpdateController extends AffectAbilityToWorkController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitAffectAbilityToWorkForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const affectAbilityToWorkForm: AffectAbilityToWorkForm = {
      affectAbilityToWork: asArray(req.body.affectAbilityToWork),
      affectAbilityToWorkOther: req.body.affectAbilityToWorkOther,
    }
    req.session.affectAbilityToWorkForm = affectAbilityToWorkForm

    const errors = validateAffectAbilityToWorkForm(affectAbilityToWorkForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/${journeyId}/affect-ability-to-work`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithAffectAbilityToWork(inductionDto, affectAbilityToWorkForm)

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username)

      req.session.affectAbilityToWorkForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
