import { FieldValidationError } from '../middleware/validationMiddleware'
import { buildErrorSummaryList } from '../utils/utils'

type Error = {
  href?: string
  text?: string
}

export default function findErrorFilter(array: FieldValidationError[], formFieldId: string): Error {
  const errors = buildErrorSummaryList(array)
  const item = errors?.find(error => error.href === `#${formFieldId}`)
  return item ? { text: item.text } : null
}
