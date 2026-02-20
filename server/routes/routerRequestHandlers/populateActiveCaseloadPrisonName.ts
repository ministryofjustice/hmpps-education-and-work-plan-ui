import { NextFunction, Request, Response, RequestHandler } from 'express'
import { PrisonService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { PrisonUser } from '../../interfaces/hmppsUser'

/**
 *  Middleware function that returns a Request handler function to lookup and store the users activeCaseload prison name in res.locals
 */
const populateActiveCaseloadPrisonName = (prisonService: PrisonService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as PrisonUser
    const { activeCaseLoadId, username } = user

    const allPrisonNamesById = await prisonService.getAllPrisonNamesById(username)
    res.locals.activeCaseloadPrisonName = allPrisonNamesById[activeCaseLoadId] || activeCaseLoadId

    next()
  })
}
export default populateActiveCaseloadPrisonName
