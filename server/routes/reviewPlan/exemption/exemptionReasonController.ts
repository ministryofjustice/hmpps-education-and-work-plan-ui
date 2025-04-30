import type { ReviewExemptionDto } from 'dto'
import type { RequestHandler } from 'express'
import type { ReviewExemptionForm } from 'reviewPlanForms'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import ExemptionReasonView from './exemptionReasonView'
import validateReviewExemptionForm from '../../validators/reviewPlan/reviewExemptionFormValidator'

export default class ExemptionReasonController {
  getExemptionReasonView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals

    // TODO - add validation that the review is in a state by which it can be exempted

    let reviewExemptionForm: ReviewExemptionForm
    if (getPrisonerContext(req.session, prisonNumber).reviewExemptionForm) {
      reviewExemptionForm = getPrisonerContext(req.session, prisonNumber).reviewExemptionForm
    } else {
      reviewExemptionForm = toReviewExemptionForm(req.journeyData.reviewExemptionDto)
    }

    getPrisonerContext(req.session, prisonNumber).reviewExemptionForm = undefined

    const view = new ExemptionReasonView(prisonerSummary, reviewExemptionForm)
    return res.render('pages/reviewPlan/exemption/exemptionReason/index', { ...view.renderArgs })
  }

  submitExemptionReasonForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { prisonId } = res.locals.prisonerSummary
    const { exemptionReason, exemptionReasonDetails } = req.body
    const selectedExemptionReasonDetails = { [exemptionReason]: exemptionReasonDetails[exemptionReason] }

    const reviewExemptionForm: ReviewExemptionForm = {
      exemptionReason,
      exemptionReasonDetails: selectedExemptionReasonDetails,
    }

    getPrisonerContext(req.session, prisonNumber).reviewExemptionForm = reviewExemptionForm

    const errors = validateReviewExemptionForm(reviewExemptionForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/plan/${prisonNumber}/${journeyId}/review/exemption`, errors)
    }

    const { reviewExemptionDto } = req.journeyData
    const updatedExemptionDto = updateDtoWithFormContents(
      reviewExemptionDto,
      prisonNumber,
      prisonId,
      reviewExemptionForm,
    )

    req.journeyData.reviewExemptionDto = updatedExemptionDto
    getPrisonerContext(req.session, prisonNumber).reviewExemptionForm = undefined

    return res.redirect(`/plan/${prisonNumber}/${journeyId}/review/exemption/confirm`)
  }
}

const toReviewExemptionForm = (dto: ReviewExemptionDto): ReviewExemptionForm => {
  return {
    exemptionReason: dto.exemptionReason,
    exemptionReasonDetails: {
      [dto.exemptionReason]: dto.exemptionReasonDetails,
    },
  }
}

const updateDtoWithFormContents = (
  dto: ReviewExemptionDto,
  prisonNumber: string,
  prisonId: string,
  form: ReviewExemptionForm,
): ReviewExemptionDto => ({
  ...dto,
  prisonNumber,
  prisonId,
  exemptionReason: form.exemptionReason,
  exemptionReasonDetails: form.exemptionReasonDetails[form.exemptionReason] || '',
})
