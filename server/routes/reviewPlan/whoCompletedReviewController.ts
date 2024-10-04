import { RequestHandler } from 'express'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'
import WhoCompletedReviewView from './whoCompletedReviewView'
import getPrisonerContext from '../../data/session/prisonerContexts'
import validateWhoCompletedReviewForm from '../validators/reviewPlan/whoCompletedReviewFormValidator'

export default class WhoCompletedReviewController {
  getWhoCompletedReviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    let whoCompletedReviewForm: WhoCompletedReviewForm
    if (getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm) {
      whoCompletedReviewForm = getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm
    } else {
      whoCompletedReviewForm = {} as WhoCompletedReviewForm
    }

    getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined

    const view = new WhoCompletedReviewView(prisonerSummary, whoCompletedReviewForm)
    return res.render('pages/reviewPlan/whoCompletedReview/index', { ...view.renderArgs })
  }

  submitWhoCompletedReviewForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params

    const whoCompletedReviewForm: WhoCompletedReviewForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = whoCompletedReviewForm

    const errors = validateWhoCompletedReviewForm(whoCompletedReviewForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/plan/${prisonNumber}/review`, errors)
    }

    return res.redirect(`/plan/${prisonNumber}/review/notes`)
  }
}
