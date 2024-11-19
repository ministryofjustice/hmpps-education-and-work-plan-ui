import type { ExemptionReasonForm } from 'forms'
import formatErrors from '../../errorFormatter'

const MAX_EXEMPTION_REASON_LENGTH = 200

export default function validateExemptionReasonForm(
  exemptionReasonForm: ExemptionReasonForm,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('exemptionReason', validateExemptionReason(exemptionReasonForm)))
  errors.push(...formatErrors(exemptionReasonForm.exemptionReason, validateExemptionReasonDetails(exemptionReasonForm)))
  return errors
}

const validateExemptionReason = (exemptionReasonForm: ExemptionReasonForm): Array<string> => {
  const errors: Array<string> = []

  const { exemptionReason } = exemptionReasonForm
  if (!exemptionReason) {
    errors.push(`Select an exemption reason to put the review on hold`)
  }

  return errors
}

const validateExemptionReasonDetails = (exemptionReasonForm: ExemptionReasonForm): Array<string> => {
  const errors: Array<string> = []

  const { exemptionReason, exemptionReasonDetails } = exemptionReasonForm

  if (exemptionReasonDetails[exemptionReason]?.length > MAX_EXEMPTION_REASON_LENGTH) {
    errors.push(`Exemption details must be ${MAX_EXEMPTION_REASON_LENGTH} characters or less`)
  }

  return errors
}
