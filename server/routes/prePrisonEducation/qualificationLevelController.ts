import { NextFunction, Request, RequestHandler, Response } from 'express'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateQualificationLevelForm from '../validators/induction/qualificationLevelFormValidator'
import QualificationLevelView from './qualificationLevelView'
import getPrisonerContext from '../../data/session/prisonerContexts'

export default class QualificationLevelController {
  getQualificationLevelView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const qualificationLevelForm = getPrisonerContext(req.session, prisonNumber).qualificationLevelForm || {
      qualificationLevel: undefined,
    }
    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined

    const view = new QualificationLevelView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      qualificationLevelForm,
    )
    return res.render('pages/prePrisonEducation/qualificationLevel', { ...view.renderArgs })
  }

  submitQualificationLevelForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const qualificationLevelForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm

    const errors = validateQualificationLevelForm(qualificationLevelForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-education/qualification-level`, errors)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-education/qualification-details`)
  }

  private getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-education/highest-level-of-education`
  }

  private getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }
}
