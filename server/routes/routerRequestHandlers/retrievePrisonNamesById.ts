import { NextFunction, Request, RequestHandler, Response } from 'express'
import { PrisonService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Middleware function that returns a Request handler function to retrieve prison names by ID from PrisonService and store in res.locals
 */
const retrievePrisonNamesById = (prisonService: PrisonService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.user

    const { apiErrorCallback } = res.locals
    res.locals.prisonNamesById = await Result.wrap(prisonService.getAllPrisonNamesById(username), apiErrorCallback)

    return next()
  }
}

export default retrievePrisonNamesById
