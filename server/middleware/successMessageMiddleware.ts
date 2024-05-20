import { NextFunction, Request, Response } from 'express'

export default function successMiddleware(req: Request, res: Response, next: NextFunction) {
  res.redirectWithSuccess = (path: string, message: string): void => {
    req.flash('successMessage', JSON.stringify({ message }))
    res.redirect(path)
  }

  if (req.method === 'GET') {
    const successMessage = req.flash('successMessage')[0]

    if (successMessage) {
      res.locals.successMessage = JSON.parse(successMessage)
    }
  }

  next()
}
