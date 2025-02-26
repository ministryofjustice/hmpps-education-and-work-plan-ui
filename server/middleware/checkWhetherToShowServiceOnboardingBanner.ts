import { NextFunction, Request, Response } from 'express'
import config from '../config'
import ApplicationRole from '../enums/applicationRole'

/**
 * Middleware that sets res.locals.showServiceOnboardingBanner to true if
 *   the user does NOT have the service EDITOR role
 *   AND
 *   the user's active caseload ID (prison ID) is NOT enabled for the service yet.
 */
const checkWhetherToShowServiceOnboardingBanner = async (req: Request, res: Response, next: NextFunction) => {
  const activeCaseloadId = res.locals.user.activeCaseLoadId || ''
  const userRoles = ((res.locals.user.roles || []) as Array<string>).map(role =>
    role.startsWith('ROLE_') ? role : `ROLE_${role}`,
  )

  res.locals.showServiceOnboardingBanner =
    !userRoles.some(role => Object.keys(ApplicationRole).includes(role)) &&
    !config.featureToggles.prisonIsEnabledForService(activeCaseloadId)

  next()
}

export default checkWhetherToShowServiceOnboardingBanner
