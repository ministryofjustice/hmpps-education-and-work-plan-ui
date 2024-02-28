import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import InductionController from './inductionController'
import AffectAbilityToWorkView from './affectAbilityToWorkView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class AffectAbilityToWorkController extends InductionController {
  constructor() {
    super()
  }

  /**
   * Returns the Personal Interests view; suitable for use by the Create and Update journeys.
   */
  getAffectAbilityToWorkView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    const affectAbilityToWorkForm = req.session.affectAbilityToWorkForm || toAffectAbilityToWorkForm(inductionDto)
    req.session.affectAbilityToWorkForm = undefined

    const view = new AffectAbilityToWorkView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      affectAbilityToWorkForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/affectAbilityToWork/index', { ...view.renderArgs })
  }
}

const toAffectAbilityToWorkForm = (inductionDto: InductionDto): AffectAbilityToWorkForm => {
  return {
    affectAbilityToWork: inductionDto.workOnRelease.affectAbilityToWork,
    affectAbilityToWorkOther: inductionDto.workOnRelease.affectAbilityToWorkOther,
  }
}
