import type { ReviewExemptionDto } from 'dto'
import type { RequestHandler } from 'express'
import type { ReviewExemptionForm } from 'reviewPlanForms'
import ExemptionReasonView from './exemptionReasonView'

export default class ExemptionReasonController {
  getExemptionReasonView: RequestHandler = async (req, res, next): Promise<void> => {
    const { reviewExemptionDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

    // TODO - add validation that the review is in a state by which it can be exempted
    // (not in the zod validator - zod validators are for form validation, not business rules validation)

    const reviewExemptionForm = invalidForm ?? toReviewExemptionForm(reviewExemptionDto)

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

    const { reviewExemptionDto } = req.journeyData
    const updatedExemptionDto = updateDtoWithFormContents(
      reviewExemptionDto,
      prisonNumber,
      prisonId,
      reviewExemptionForm,
    )

    req.journeyData.reviewExemptionDto = updatedExemptionDto

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
