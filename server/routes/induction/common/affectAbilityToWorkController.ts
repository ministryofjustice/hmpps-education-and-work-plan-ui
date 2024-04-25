import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import InductionController from './inductionController'
import AffectAbilityToWorkView from './affectAbilityToWorkView'

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
    const { prisonerSummary, inductionDto } = req.session

    const affectAbilityToWorkForm = req.session.affectAbilityToWorkForm || toAffectAbilityToWorkForm(inductionDto)
    req.session.affectAbilityToWorkForm = undefined

    // Check if we are in the midst of changing the main induction question set (in this case from short route to long route)
    if (req.session.updateInductionQuestionSet) {
      this.addCurrentPageToHistory(req)
    }

    const view = new AffectAbilityToWorkView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      affectAbilityToWorkForm,
      req.flash('errors'),
    )
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
        affectAbilityToWorkOther: affectAbilityToWorkForm.affectAbilityToWorkOther,
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
