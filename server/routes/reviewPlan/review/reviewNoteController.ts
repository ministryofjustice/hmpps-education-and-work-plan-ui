import { RequestHandler } from 'express'
import type { ReviewPlanDto } from 'dto'
import type { ReviewNoteForm } from 'reviewPlanForms'
import ReviewNoteView from './reviewNoteView'

export default class ReviewNoteController {
  getReviewNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    const { reviewPlanDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

    const reviewNoteForm = invalidForm ?? toReviewNoteForm(reviewPlanDto)

    const view = new ReviewNoteView(prisonerSummary, reviewNoteForm)
    return res.render('pages/reviewPlan/review/reviewNote/index', { ...view.renderArgs })
  }

  submitReviewNoteForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, journeyId } = req.params

    const reviewNoteForm = { ...req.body }

    const { reviewPlanDto } = req.journeyData
    const updatedReviewPlanDto = updateDtoWithFormContents(reviewPlanDto, reviewNoteForm)
    req.journeyData.reviewPlanDto = updatedReviewPlanDto

    return res.redirect(`/plan/${prisonNumber}/${journeyId}/review/check-your-answers`)
  }
}

const toReviewNoteForm = (dto: ReviewPlanDto): ReviewNoteForm => ({
  notes: dto.notes,
})

const updateDtoWithFormContents = (dto: ReviewPlanDto, form: ReviewNoteForm): ReviewPlanDto => ({
  ...dto,
  notes: form.notes,
})
