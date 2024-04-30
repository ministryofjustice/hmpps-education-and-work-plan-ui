import { RequestHandler } from 'express'

export default function errorMessageMiddleware(): RequestHandler {
  return (req, res, next) => {
    if (req.method === 'GET') {
      const validationErrors = req.flash('validationErrors')[0]
      const formValues = req.flash('formValues')[0]

      if (validationErrors) {
        res.locals.validationErrors = JSON.parse(validationErrors)
      }

      if (formValues) {
        res.locals.formValues = JSON.parse(formValues)
      }
    }
    next()
  }
}
