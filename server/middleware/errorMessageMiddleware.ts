import { NextFunction, Request, Response } from 'express'

export default function errorMessageMiddleware(req: Request, res: Response, next: NextFunction) {
  res.redirectWithErrors = (path: string, messages: Record<string, string>[]): void => {
    req.flash('errors', JSON.stringify(messages))
    res.redirect(path)
  }

  if (req.method === 'GET') {
    const errorMessages = req.flash('errors')[0]
    const invalidForm = req.flash('invalidForm')[0]

    if (errorMessages) {
      res.locals.errors = JSON.parse(errorMessages)
    }
    if (invalidForm) {
      res.locals.invalidForm = JSON.parse(invalidForm)
    }
  }

  next()
}
