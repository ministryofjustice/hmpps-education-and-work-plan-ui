import { RequestHandler } from 'express'
import { format, parse, startOfDay } from 'date-fns'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'
import type { ReviewPlanDto } from 'dto'
import WhoCompletedReviewView from './whoCompletedReviewView'

export default class WhoCompletedReviewController {
  getWhoCompletedReviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { reviewPlanDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

    const whoCompletedReviewForm = invalidForm ?? toWhoCompletedReviewForm(reviewPlanDto)

    const view = new WhoCompletedReviewView(prisonerSummary, whoCompletedReviewForm)
    return res.render('pages/reviewPlan/review/whoCompletedReview/index', { ...view.renderArgs })
  }

  submitWhoCompletedReviewForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { prisonId } = res.locals.prisonerSummary

    const whoCompletedReviewForm = { ...req.body }

    const { reviewPlanDto } = req.journeyData
    const updatedReviewPlanDto = updateDtoWithFormContents(
      reviewPlanDto,
      whoCompletedReviewForm,
      prisonNumber,
      prisonId,
    )
    req.journeyData.reviewPlanDto = updatedReviewPlanDto

    return res.redirect(
      req.query?.submitToCheckAnswers === 'true'
        ? `/plan/${prisonNumber}/${journeyId}/review/check-your-answers`
        : `/plan/${prisonNumber}/${journeyId}/review/notes`,
    )
  }
}

const toWhoCompletedReviewForm = (dto: ReviewPlanDto): WhoCompletedReviewForm => {
  const reviewDate = dto.reviewDate ? startOfDay(dto.reviewDate) : undefined
  return {
    completedBy: dto.completedBy,
    completedByOtherFullName: dto.completedByOtherFullName,
    completedByOtherJobRole: dto.completedByOtherJobRole,
    reviewDate: reviewDate ? format(reviewDate, 'd/M/yyyy') : undefined,
  }
}

const updateDtoWithFormContents = (
  dto: ReviewPlanDto,
  form: WhoCompletedReviewForm,
  prisonNumber: string,
  prisonId: string,
): ReviewPlanDto => ({
  ...dto,
  prisonNumber,
  prisonId,
  completedBy: form.completedBy,
  completedByOtherFullName: form.completedByOtherFullName,
  completedByOtherJobRole: form.completedByOtherJobRole,
  reviewDate: startOfDay(parse(form.reviewDate, 'd/M/yyyy', new Date())),
})
