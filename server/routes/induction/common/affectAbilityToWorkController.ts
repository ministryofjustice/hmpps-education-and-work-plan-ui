import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import InductionController from './inductionController'
import AffectAbilityToWorkView from './affectAbilityToWorkView'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class AffectAbilityToWorkController extends InductionController {
  /**
   * Returns the Affects on Ability To Work view; suitable for use by the Create and Update journeys.
   */
  getAffectAbilityToWorkView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const affectAbilityToWorkForm: AffectAbilityToWorkForm =
      getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm || toAffectAbilityToWorkForm(inductionDto)
    getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm = undefined

    const view = new AffectAbilityToWorkView(prisonerSummary, affectAbilityToWorkForm)
    return res.render('pages/induction/affectAbilityToWork/index', { ...view.renderArgs })
  }

  protected updatedInductionDtoWithAffectAbilityToWork(
    inductionDto: InductionDto,
    affectAbilityToWorkForm: AffectAbilityToWorkForm,
  ): InductionDto {
    return {
      ...inductionDto,
      workOnRelease: {
        ...inductionDto.workOnRelease,
        affectAbilityToWork: affectAbilityToWorkForm.affectAbilityToWork,
        affectAbilityToWorkOther: affectAbilityToWorkForm.affectAbilityToWork.includes(AbilityToWorkValue.OTHER)
          ? affectAbilityToWorkForm.affectAbilityToWorkOther
          : undefined,
      },
    }
  }
}

const toAffectAbilityToWorkForm = (inductionDto: InductionDto): AffectAbilityToWorkForm => {
  return {
    affectAbilityToWork: inductionDto.workOnRelease.affectAbilityToWork || [],
    affectAbilityToWorkOther: inductionDto.workOnRelease.affectAbilityToWorkOther,
  }
}
