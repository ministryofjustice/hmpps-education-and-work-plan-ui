import { RequestHandler } from 'express'
import { Services } from '../services'

export default function getFrontendComponents({ frontendComponentService }: Services): RequestHandler {
  return async (req, res, next) => {
    res.locals.feComponents = await frontendComponentService.getComponents(res.locals.user.token)
    next()
  }
}
