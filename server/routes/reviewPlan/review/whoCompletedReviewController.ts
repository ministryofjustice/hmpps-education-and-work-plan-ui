import { Request, RequestHandler } from 'express'
import { format, parse, startOfDay } from 'date-fns'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'
import type { ReviewPlanDto } from 'dto'
import WhoCompletedReviewView from './whoCompletedReviewView'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import validateWhoCompletedReviewForm from '../../validators/reviewPlan/whoCompletedReviewFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'

export default class WhoCompletedReviewController {
  getWhoCompletedReviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals

    let whoCompletedReviewForm: WhoCompletedReviewForm
    if (getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm) {
      whoCompletedReviewForm = getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm
    } else {
      whoCompletedReviewForm = toWhoCompletedReviewForm(req.journeyData.reviewPlanDto)
    }

    getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined

    const view = new WhoCompletedReviewView(prisonerSummary, whoCompletedReviewForm)
    return res.render('pages/reviewPlan/review/whoCompletedReview/index', { ...view.renderArgs })
  }

  submitWhoCompletedReviewForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { prisonId } = res.locals.prisonerSummary

    const whoCompletedReviewForm: WhoCompletedReviewForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = whoCompletedReviewForm

    const errors = validateWhoCompletedReviewForm(whoCompletedReviewForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/plan/${prisonNumber}/${journeyId}/review`, errors)
    }

    const { reviewPlanDto } = req.journeyData
    const updatedReviewPlanDto = updateDtoWithFormContents(
      reviewPlanDto,
      whoCompletedReviewForm,
      prisonNumber,
      prisonId,
    )
    req.journeyData.reviewPlanDto = updatedReviewPlanDto
    getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined

    return previousPageWasCheckYourAnswers(req)
      ? res.redirect(`/plan/${prisonNumber}/${journeyId}/review/check-your-answers`)
      : res.redirect(`/plan/${prisonNumber}/${journeyId}/review/notes`)
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

const previousPageWasCheckYourAnswers = (req: Request): boolean => {
  const { pageFlowHistory } = req.session
  if (!pageFlowHistory) {
    return false
  }
  const previousPage = getPreviousPage(pageFlowHistory)
  if (previousPage) {
    return previousPage.endsWith('/check-your-answers')
  }

  if (pageFlowHistory.currentPageIndex === 0 && pageFlowHistory.pageUrls.length === 1) {
    return pageFlowHistory.pageUrls.at(0).endsWith('/check-your-answers')
  }

  return false
}
