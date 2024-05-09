import { RequestHandler } from 'express'
import logger from '../../logger'
import UserService from '../services/userService'

export function populateCurrentUser(userService: UserService): RequestHandler {
  return async (req, res, next) => {
    try {
      if (res.locals.user) {
        const user = res.locals.user && (await userService.getUser(res.locals.user.token))
        if (user) {
          res.locals.user = { ...user, ...res.locals.user }
        } else {
          logger.info('No user available')
        }
      }
      next()
    } catch (error) {
      logger.error(error, `Failed to retrieve user for: ${res.locals.user && res.locals.user.username}`)
      next(error)
    }
  }
}

export function populateCurrentUserCaseloads(userService: UserService): RequestHandler {
  return async (req, res, next) => {
    try {
      if (res.locals.user && res.locals.user.authSource === 'nomis') {
        const userCaseLoadDetail = await userService.getUserCaseLoads(res.locals.user.token)

        res.locals.user.caseLoadIds = userCaseLoadDetail.caseloads.map(caseload => caseload.id)

        if (userCaseLoadDetail.activeCaseload) {
          res.locals.user.activeCaseLoadId = userCaseLoadDetail.activeCaseload.id
        }
      }
      next()
    } catch (error) {
      logger.error(error, `Failed to retrieve case loads for: ${res.locals.user.username}`)
      // Deliberately call next without the error. This will mean that the user has no caseloads so any code downstream
      // of this that check caseload IDs (such as other middlewares) will fail gracefully with an appropriate error.
      next()
    }
  }
}
