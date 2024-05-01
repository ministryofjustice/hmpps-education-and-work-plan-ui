import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { RequestHandler } from 'express'

export type FieldValidationError = {
  field: string
  message: string
}

export const buildErrorSummaryList = (array: FieldValidationError[]) => {
  if (!array) return null
  return array.map((error: FieldValidationError) => ({
    text: error.message,
    href: `#${error.field}`,
  }))
}

export const flattenErrors = (errorList: ValidationError[], parentPrefix?: string): FieldValidationError[] => {
  const propPrefix = parentPrefix ? `${parentPrefix}-` : ''
  return errorList.flatMap(err => {
    const property = propPrefix + err.property
    if (err.children && err.children.length > 0) {
      return flattenErrors(err.children, property)
    }
    return Object.values(err.constraints ?? {}).map(errorMessage => ({
      field: property,
      message: errorMessage,
    }))
  })
}

export default function validationMiddleware(type: new () => object): RequestHandler {
  return async (req, res, next) => {
    if (!type) return next()

    // Build an object which is used by validators to check things against
    const requestObject = plainToInstance(type, { ...req.body })

    const errors: ValidationError[] = await validate(requestObject, {
      forbidUnknownValues: false,
    })

    if (errors.length === 0) {
      req.body = requestObject
      return next()
    }

    const fieldValidationErrors = flattenErrors(errors)
    const validationErrors = buildErrorSummaryList(fieldValidationErrors)

    req.flash('formValues', JSON.stringify(req.body))
    req.flash('validationErrors', JSON.stringify(validationErrors))

    return res.redirect('back')
  }
}
