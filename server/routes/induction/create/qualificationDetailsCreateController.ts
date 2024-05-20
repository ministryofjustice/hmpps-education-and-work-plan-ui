import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PageFlow } from 'viewModels'
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
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/qualification-details`, errors)
    }

    const updatedInduction = this.addQualificationToInductionDto(
      inductionDto,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    req.session.inductionDto = updatedInduction

    req.session.qualificationDetailsForm = undefined
    req.session.qualificationLevelForm = undefined

    if (!this.checkYourAnswersIsTheFirstPageInThePageHistory(req)) {
      // If the qualifications mini-flow did not start from Check Your Answers clear the Page Flow History before
      // redirecting back to the Qualifications List page
      req.session.pageFlowHistory = undefined
    } else {
      // If the qualifications mini-flow did start from Check Your Answers setup a new Page Flow History containing just
      // Check Your Answers before redirecting back to the Qualifications List page so that it's Back link is Check Your Answers
      req.session.pageFlowHistory = pageFlowHistoryContainingJustCheckYourAnswers(prisonNumber)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/qualifications`)
  }
}

const pageFlowHistoryContainingJustCheckYourAnswers = (prisonNumber: string): PageFlow => ({
  pageUrls: [`/prisoners/${prisonNumber}/create-induction/check-your-answers`],
  currentPageIndex: 0,
})
