import { Request, RequestHandler, Response } from 'express'
import WantToAddQualificationsController from '../common/wantToAddQualificationsController'
import YesNoValue from '../../../enums/yesNoValue'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateWantToAddQualificationsForm from '../../validators/induction/wantToAddQualificationsFormValidator'

export default class WantToAddQualificationsCreateController extends WantToAddQualificationsController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-induction/reasons-not-to-get-work`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitWantToAddQualificationsForm: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    req.session.wantToAddQualificationsForm = { ...req.body }
    const { wantToAddQualificationsForm } = req.session

    const errors = validateWantToAddQualificationsForm(wantToAddQualificationsForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`)
    }

    req.session.wantToAddQualificationsForm = undefined

    const nextPage =
      wantToAddQualificationsForm.wantToAddQualifications === YesNoValue.YES
        ? `/prisoners/${prisonNumber}/create-induction/qualification-level`
        : `/prisoners/${prisonNumber}/create-induction/additional-training`

    return res.redirect(nextPage)
  }
}
