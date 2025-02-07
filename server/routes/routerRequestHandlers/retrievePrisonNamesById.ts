import { NextFunction, Request, RequestHandler, Response } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { PrisonService } from '../../services'

/**
 *  Middleware function that returns a Request handler function to retrieve prison names by ID from PrisonService and store in res.locals
 */
const retrievePrisonNamesById = (prisonService: PrisonService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    res.locals.prisonNamesById = await prisonService.getAllPrisonNamesById(req.user.username)

    next()
  })
}

export default retrievePrisonNamesById
