import type { RequestHandler } from 'express'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import ConfirmExemptionView from './confirmExemptionView'

export default class ConfirmExemptionController {
  getConfirmExemptionView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { reviewExemptionDto } = getPrisonerContext(req.session, prisonNumber)

    const view = new ConfirmExemptionView(prisonerSummary, reviewExemptionDto)
    return res.render('pages/reviewPlan/confirmExemption/index', {
      ...view.renderArgs,
    })
  }

  submitConfirmExemption: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    getPrisonerContext(req.session, prisonNumber)
    return res.redirect(`/plan/${prisonNumber}/view/overview`)
  }
}
