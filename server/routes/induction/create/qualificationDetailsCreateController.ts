import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationDetailsController from '../common/qualificationDetailsController'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateQualificationDetailsForm from '../../validators/induction/qualificationDetailsFormValidator'

export default class QualificationDetailsCreateController extends QualificationDetailsController {
  getBackLinkUrl(req: Request): string {
    const { pageFlowHistory } = req.session
    return getPreviousPage(pageFlowHistory)
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitQualificationDetailsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto, qualificationLevelForm } = req.session

    req.session.qualificationDetailsForm = { ...req.body }
    const { qualificationDetailsForm } = req.session

    const errors = validateQualificationDetailsForm(
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
      prisonerSummary,
    )
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/qualification-details`)
    }

    const updatedInduction = this.addQualificationToInductionDto(
      inductionDto,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    req.session.inductionDto = updatedInduction

    req.session.qualificationDetailsForm = undefined
    req.session.qualificationLevelForm = undefined

    req.session.pageFlowHistory = undefined

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/qualifications`)
  }
}
