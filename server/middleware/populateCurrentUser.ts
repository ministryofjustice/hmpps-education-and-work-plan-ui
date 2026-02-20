import { RequestHandler } from 'express'
import { jwtDecode } from 'jwt-decode'
import logger from '../../logger'
import UserService from '../services/userService'
import { convertToTitleCase } from '../utils/utils'

export function populateCurrentUser(): RequestHandler {
  return async (req, res, next) => {
    try {
      const {
        name,
        user_id: userId,
        user_name: username,
        auth_source: authSource,
        authorities: roles = [],
      } = jwtDecode(res.locals.user.token) as {
        name?: string
        user_id?: string
        user_name?: string
        auth_source?: 'nomis' | 'delius' | 'external' | 'azuread'
        authorities?: string[]
      }

      res.locals.user = {
        ...res.locals.user,
        userId,
        name,
        authSource: authSource as never,
        username,
        displayName: convertToTitleCase(name),
        userRoles: roles.map(role => role.substring(role.indexOf('_') + 1)),
      }

      if (res.locals.user.authSource === 'nomis') {
        res.locals.user.staffId = +userId || undefined
      }

      next()
    } catch (error) {
      logger.error(error, `Failed to populate user details for: ${res.locals.user && res.locals.user.username}`)
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
