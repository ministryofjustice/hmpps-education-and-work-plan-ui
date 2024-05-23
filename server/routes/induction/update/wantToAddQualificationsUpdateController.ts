import { NextFunction, Request, RequestHandler, Response } from 'express'
import WantToAddQualificationsController from '../common/wantToAddQualificationsController'
import YesNoValue from '../../../enums/yesNoValue'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateWantToAddQualificationsForm from '../../validators/induction/wantToAddQualificationsFormValidator'

export default class WantToAddQualificationsUpdateController extends WantToAddQualificationsController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitWantToAddQualificationsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    req.session.wantToAddQualificationsForm = { ...req.body }
    const { wantToAddQualificationsForm } = req.session

    const errors = validateWantToAddQualificationsForm(wantToAddQualificationsForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/want-to-add-qualifications`, errors)
    }

    req.session.wantToAddQualificationsForm = undefined

    // If the previous page was Check Your Answers
    if (this.previousPageWasCheckYourAnswers(req)) {
      if (this.formSubmittedFromCheckYourAnswersWithNoChangeMade(wantToAddQualificationsForm, inductionDto)) {
        // No changes made, redirect back to Check Your Answers
        return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      }

      if (this.formSubmittedIndicatingQualificationsShouldNotBeRecorded(wantToAddQualificationsForm)) {
        // User has come from the Check Your Answers page and has said they do not want to record any qualifications
        // We need to remove any qualifications that may have been set on the Induction
        const updatedInduction = this.inductionWithRemovedQualifications(inductionDto)
        req.session.inductionDto = updatedInduction
        return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      }

      // User has come from the Check Your Answers page and has said they DO want to record qualifications
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualifications`)
    }

    const nextPage =
      wantToAddQualificationsForm.wantToAddQualifications === YesNoValue.YES
        ? `/prisoners/${prisonNumber}/induction/qualification-level`
        : `/prisoners/${prisonNumber}/induction/additional-training`

    return res.redirect(nextPage)
  }
}
