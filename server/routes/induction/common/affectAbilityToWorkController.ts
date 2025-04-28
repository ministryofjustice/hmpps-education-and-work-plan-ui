import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import InductionController from './inductionController'
import AffectAbilityToWorkView from './affectAbilityToWorkView'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'

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
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals

    const affectAbilityToWorkForm = req.session.affectAbilityToWorkForm || toAffectAbilityToWorkForm(inductionDto)
    req.session.affectAbilityToWorkForm = undefined

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

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
