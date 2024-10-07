import { RequestHandler } from 'express'
import { format, startOfDay } from 'date-fns'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'
import type { ReviewPlanDto } from 'dto'
import WhoCompletedReviewView from './whoCompletedReviewView'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import validateWhoCompletedReviewForm from '../validators/reviewPlan/whoCompletedReviewFormValidator'

export default class WhoCompletedReviewController {
  getWhoCompletedReviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    let whoCompletedReviewForm: WhoCompletedReviewForm
    if (getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm) {
      whoCompletedReviewForm = getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm
    } else {
      whoCompletedReviewForm = toWhoCompletedReviewForm(getPrisonerContext(req.session, prisonNumber).reviewPlanDto)
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

    const { reviewPlanDto } = getPrisonerContext(req.session, prisonNumber)
    const updatedReviewPlanDto = updateDtoWithFormContents(reviewPlanDto, whoCompletedReviewForm)
    getPrisonerContext(req.session, prisonNumber).reviewPlanDto = updatedReviewPlanDto
    getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined

    return res.redirect(`/plan/${prisonNumber}/review/notes`)
  }
}

const toWhoCompletedReviewForm = (dto: ReviewPlanDto): WhoCompletedReviewForm => {
  const reviewDate = dto.reviewDate ? startOfDay(dto.reviewDate) : undefined
  return {
    completedBy: dto.completedBy,
    completedByOther: dto.completedByOther,
    'reviewDate-day': reviewDate ? `${reviewDate.getDate()}`.padStart(2, '0') : undefined,
    'reviewDate-month': reviewDate ? `${reviewDate.getMonth() + 1}`.padStart(2, '0') : undefined,
    'reviewDate-year': reviewDate ? `${reviewDate.getFullYear()}` : undefined,
  }
}

const updateDtoWithFormContents = (dto: ReviewPlanDto, form: WhoCompletedReviewForm): ReviewPlanDto => ({
  ...dto,
  completedBy: form.completedBy,
  completedByOther: form.completedByOther,
  reviewDate: format(
    startOfDay(
      `${form['reviewDate-year']}-${form['reviewDate-month'].padStart(2, '0')}-${form['reviewDate-day'].padStart(2, '0')}`,
    ),
    'yyyy-MM-dd',
  ),
})
