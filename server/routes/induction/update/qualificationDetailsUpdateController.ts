import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationDetailsController from '../common/qualificationDetailsController'
import validateQualificationDetailsForm from '../../validators/induction/qualificationDetailsFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

/**
 * Controller for the Update of the Qualification Details screen of the Induction.
 */
export default class QualificationDetailsUpdateController extends QualificationDetailsController {
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
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/qualification-details`, errors)
    }

    const updatedInduction = this.addQualificationToInductionDto(
      inductionDto,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    req.session.inductionDto = updatedInduction

    req.session.qualificationDetailsForm = undefined
    req.session.qualificationLevelForm = undefined

    if (req.session.updateInductionQuestionSet) {
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualifications`)
    }

    req.session.pageFlowHistory = undefined
    return res.redirect(`/prisoners/${prisonNumber}/induction/qualifications`)
  }
}
