import type { RequestHandler } from 'express'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import formatExemptionReasonValueFilter from '../../filters/formatExemptionReasonValueFilter'
import ConfirmExemptionView from './confirmExemptionView'

export default class ConfirmExemptionController {
  getConfirmExemptionView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const prisonerContext = getPrisonerContext(req.session, prisonNumber)
    const { reviewExemptionForm } = prisonerContext
    const exemptionReason = formatExemptionReasonValueFilter(reviewExemptionForm?.exemptionReason || '')
    const exemptionReasonDetails =
      reviewExemptionForm?.exemptionReasonDetails?.[reviewExemptionForm.exemptionReason] || ''
    const view = new ConfirmExemptionView(prisonerSummary)
    return res.render('pages/reviewPlan/confirmExemption/index', {
      ...view.renderArgs,
      exemptionReason,
      exemptionReasonDetails,
    })
  }

  submitConfirmExemption: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    getPrisonerContext(req.session, prisonNumber)
    return res.redirect(`/plan/${prisonNumber}/view/overview`)
  }
}
