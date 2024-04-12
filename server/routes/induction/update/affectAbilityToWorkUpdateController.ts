import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InductionDto } from 'inductionDto'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import AffectAbilityToWorkController from '../common/affectAbilityToWorkController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateAffectAbilityToWorkForm from './affectAbilityToWorkFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

/**
 * Controller for the Update of the Factors Affecting a Prisoner's Ability To Work screen of the Induction.
 */
export default class AffectAbilityToWorkUpdateController extends AffectAbilityToWorkController {
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

  submitAffectAbilityToWorkForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.affectAbilityToWorkForm = { ...req.body }
    if (!req.session.affectAbilityToWorkForm.affectAbilityToWork) {
      req.session.affectAbilityToWorkForm.affectAbilityToWork = []
    }
    if (!Array.isArray(req.session.affectAbilityToWorkForm.affectAbilityToWork)) {
      req.session.affectAbilityToWorkForm.affectAbilityToWork = [
        req.session.affectAbilityToWorkForm.affectAbilityToWork,
      ]
    }
    const { affectAbilityToWorkForm } = req.session

    const errors = validateAffectAbilityToWorkForm(affectAbilityToWorkForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/affect-ability-to-work`)
    }

    const updatedInduction = this.updatedInductionDtoWithAffectAbilityToWork(inductionDto, affectAbilityToWorkForm)

    // if we are switching from the short question set to the long one, forward to the check your answers page
    if (req.session.updateInductionQuestionSet) {
      req.session.inductionDto = updatedInduction
      req.session.affectAbilityToWorkForm = undefined
      return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
    }

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.affectAbilityToWorkForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  private updatedInductionDtoWithAffectAbilityToWork(
    inductionDto: InductionDto,
    affectAbilityToWorkForm: AffectAbilityToWorkForm,
  ): InductionDto {
    return {
      ...inductionDto,
      workOnRelease: {
        ...inductionDto.workOnRelease,
        affectAbilityToWork: affectAbilityToWorkForm.affectAbilityToWork,
        affectAbilityToWorkOther: affectAbilityToWorkForm.affectAbilityToWorkOther,
      },
    }
  }
}
