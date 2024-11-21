import type { RequestHandler } from 'express'
import type { ReviewExemptionForm } from 'reviewPlanForms'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import ExemptionReasonView from './exemptionReasonView'
import validateReviewExemptionForm from '../validators/reviewPlan/reviewExemptionFormValidator'

export default class ExemptionReasonController {
  getExemptionReasonView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const prisonerContext = getPrisonerContext(req.session, prisonNumber)

    const { reviewExemptionForm } = prisonerContext

    const view = new ExemptionReasonView(prisonerSummary, reviewExemptionForm)
    return res.render('pages/reviewPlan/exemptionReason/index', { ...view.renderArgs })
  }

  submitExemptionReasonForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { exemptionReason, exemptionReasonDetails = {} } = req.body

    const reviewExemptionForm: ReviewExemptionForm = {
      exemptionReason,
      exemptionReasonDetails: {
        [exemptionReason]: exemptionReasonDetails[exemptionReason],
      },
    }

    const prisonerContext = getPrisonerContext(req.session, prisonNumber)
    prisonerContext.reviewExemptionForm = reviewExemptionForm

    const errors = validateReviewExemptionForm(reviewExemptionForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/plan/${prisonNumber}/review/exemption`, errors)
    }

    return res.redirect(`/plan/${prisonNumber}/review/exemption/confirm`)
  }
}
