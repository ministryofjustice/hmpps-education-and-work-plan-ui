import { RequestHandler } from 'express'
import type { ReviewPlanDto } from 'dto'
import type { ReviewNoteForm } from 'reviewPlanForms'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import ReviewNoteView from './reviewNoteView'

export default class ReviewNoteController {
  getReviewNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    let reviewNoteForm: ReviewNoteForm
    if (getPrisonerContext(req.session, prisonNumber).reviewNoteForm) {
      reviewNoteForm = getPrisonerContext(req.session, prisonNumber).reviewNoteForm
    } else {
      reviewNoteForm = toReviewNoteForm(getPrisonerContext(req.session, prisonNumber).reviewPlanDto)
    }

    getPrisonerContext(req.session, prisonNumber).reviewNoteForm = undefined

    const view = new ReviewNoteView(prisonerSummary, reviewNoteForm)
    return res.render('pages/reviewPlan/reviewNote/index', { ...view.renderArgs })
  }

  submitReviewNoteForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params

    const reviewNoteForm: ReviewNoteForm = { ...req.body }

    const { reviewPlanDto } = getPrisonerContext(req.session, prisonNumber)
    const updatedReviewPlanDto = updateDtoWithFormContents(reviewPlanDto, reviewNoteForm)
    getPrisonerContext(req.session, prisonNumber).reviewPlanDto = updatedReviewPlanDto

    return res.redirect(`/plan/${prisonNumber}/review/check-your-answers`)
  }
}

const toReviewNoteForm = (dto: ReviewPlanDto): ReviewNoteForm => ({
  notes: dto.notes,
})

const updateDtoWithFormContents = (dto: ReviewPlanDto, form: ReviewNoteForm): ReviewPlanDto => ({
  ...dto,
  notes: form.notes,
})
