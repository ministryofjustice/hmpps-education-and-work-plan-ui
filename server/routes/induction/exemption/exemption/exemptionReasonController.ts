import type { InductionExemptionDto } from 'inductionDto'
import type { RequestHandler } from 'express'
import type { InductionExemptionForm } from 'inductionForms'
import { getPrisonerContext } from '../../../../data/session/prisonerContexts'
import ExemptionReasonView from './exemptionReasonView'
import validateInductionExemptionForm from '../../../validators/induction/inductionExemptionFormValidator'

export default class ExemptionReasonController {
  getExemptionReasonView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionExemptionDto } = req.journeyData

    const inductionExemptionForm: InductionExemptionForm =
      getPrisonerContext(req.session, prisonNumber).inductionExemptionForm ??
      toInductionExemptionForm(inductionExemptionDto)

    getPrisonerContext(req.session, prisonNumber).inductionExemptionForm = undefined

    const view = new ExemptionReasonView(prisonerSummary, inductionExemptionForm)
    return res.render('pages/induction/exemption/exemptionReason/index', { ...view.renderArgs })
  }

  submitExemptionReasonForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { prisonId } = res.locals.prisonerSummary
    const { exemptionReason, exemptionReasonDetails } = req.body
    const selectedExemptionReasonDetails = { [exemptionReason]: exemptionReasonDetails[exemptionReason] }

    const inductionExemptionForm: InductionExemptionForm = {
      exemptionReason,
      exemptionReasonDetails: selectedExemptionReasonDetails,
    }

    getPrisonerContext(req.session, prisonNumber).inductionExemptionForm = inductionExemptionForm
    const errors = validateInductionExemptionForm(inductionExemptionForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/${journeyId}/exemption`, errors)
    }

    const { inductionExemptionDto } = req.journeyData
    const updatedExemptionDto = updateDtoWithFormContents(
      inductionExemptionDto,
      prisonNumber,
      prisonId,
      inductionExemptionForm,
    )

    req.journeyData.inductionExemptionDto = updatedExemptionDto
    getPrisonerContext(req.session, prisonNumber).inductionExemptionForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/induction/${journeyId}/exemption/confirm`)
  }
}

const toInductionExemptionForm = (dto: InductionExemptionDto): InductionExemptionForm => {
  return {
    exemptionReason: dto.exemptionReason,
    exemptionReasonDetails: {
      [dto.exemptionReason]: dto.exemptionReasonDetails,
    },
  }
}

const updateDtoWithFormContents = (
  dto: InductionExemptionDto,
  prisonNumber: string,
  prisonId: string,
  form: InductionExemptionForm,
): InductionExemptionDto => ({
  ...dto,
  prisonNumber,
  prisonId,
  exemptionReason: form.exemptionReason,
  exemptionReasonDetails: form.exemptionReasonDetails[form.exemptionReason] || '',
})
