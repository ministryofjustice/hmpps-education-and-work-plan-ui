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

    let inductionExemptionForm: InductionExemptionForm
    if (getPrisonerContext(req.session, prisonNumber).inductionExemptionForm) {
      inductionExemptionForm = getPrisonerContext(req.session, prisonNumber).inductionExemptionForm
    } else {
      inductionExemptionForm = toInductionExemptionForm(
        getPrisonerContext(req.session, prisonNumber).inductionExemptionDto,
      )
    }

    getPrisonerContext(req.session, prisonNumber).inductionExemptionForm = undefined

    const view = new ExemptionReasonView(prisonerSummary, inductionExemptionForm)
    return res.render('pages/induction/exemption/exemptionReason/index', { ...view.renderArgs })
  }

  submitExemptionReasonForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
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
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/exemption`, errors)
    }

    const { inductionExemptionDto } = getPrisonerContext(req.session, prisonNumber)
    const updatedExemptionDto = updateDtoWithFormContents(
      inductionExemptionDto,
      prisonNumber,
      prisonId,
      inductionExemptionForm,
    )

    getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = updatedExemptionDto
    getPrisonerContext(req.session, prisonNumber).inductionExemptionForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/induction/exemption/confirm`)
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
