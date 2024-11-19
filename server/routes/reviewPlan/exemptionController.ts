import type { ExemptionReasonForm } from 'forms'
import type { RequestHandler } from 'express'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import ExemptionReasonView from './exemptionView'
import validateExemptionReasonForm from '../validators/reviewPlan/exemptionValidator'

export default class ExemptionReasonController {
  getExemptionReasonView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const prisonerContext = getPrisonerContext(req.session, prisonNumber)

    const { exemptionReasonForm } = prisonerContext

    const view = new ExemptionReasonView(prisonerSummary, exemptionReasonForm)
    return res.render('pages/reviewPlan/exemption/index', { ...view.renderArgs })
  }

  submitExemptionReasonForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { exemptionReason, exemptionReasonDetails = {} } = req.body

    const exemptionReasonForm: ExemptionReasonForm = {
      exemptionReason,
      exemptionReasonDetails: {
        [exemptionReason]: exemptionReasonDetails[exemptionReason],
      },
    }

    const prisonerContext = getPrisonerContext(req.session, prisonNumber)
    prisonerContext.exemptionReasonForm = exemptionReasonForm

    const errors = validateExemptionReasonForm(exemptionReasonForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/plan/${prisonNumber}/review/exemption`, errors)
    }

    return res.redirect(`/plan/${prisonNumber}/view/overview`)
  }
}
