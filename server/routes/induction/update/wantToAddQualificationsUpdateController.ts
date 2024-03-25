import { NextFunction, Request, RequestHandler, Response } from 'express'
import WantToAddQualificationsController from '../common/wantToAddQualificationsController'
import validateWantToAddQualificationsForm from './wantToAddQualificationsFormValidator'
import YesNoValue from '../../../enums/yesNoValue'
import { addPage } from '../../pageFlowQueue'

export default class WantToAddQualificationsUpdateController extends WantToAddQualificationsController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`
  }

  getBackLinkAriaText(req: Request): string {
    const { prisonerSummary } = req.session
    return `Back to What could stop ${prisonerSummary.firstName} ${prisonerSummary.lastName} working when they are released?`
  }

  submitWantToAddQualificationsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    req.session.wantToAddQualificationsForm = { ...req.body }
    const { wantToAddQualificationsForm } = req.session

    const errors = validateWantToAddQualificationsForm(wantToAddQualificationsForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/want-to-add-qualifications`)
    }

    // The 'Want to Add Qualifications' page is only displayed when switching from the long route set to the short one.
    // Therefore, we should already have a pageFlow in the session.
    const { pageFlowQueue } = req.session
    const nextPage =
      wantToAddQualificationsForm.wantToAddQualifications === YesNoValue.YES
        ? `/prisoners/${prisonNumber}/induction/qualification-level`
        : `/prisoners/${prisonNumber}/induction/additional-training`
    const updatedPageFlowQueue = addPage(pageFlowQueue, nextPage)
    req.session.pageFlowQueue = updatedPageFlowQueue

    return res.redirect(nextPage)
  }
}
