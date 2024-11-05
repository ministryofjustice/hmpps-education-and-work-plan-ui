import { NextFunction, Request, Response } from 'express'
import config from '../config'
import { ApplicationRoles } from './roleBasedAccessControl'

/**
 * Middleware that sets res.locals.showServiceOnboardingBanner to true if
 *   the user does NOT have the service EDITOR role
 *   AND
 *   the user's active caseload ID (prison ID) is NOT enabled for the service yet.
 */
const checkWhetherToShowServiceOnboardingBanner = async (req: Request, res: Response, next: NextFunction) => {
  const activeCaseloadId = res.locals.user.activeCaseLoadId || ''
  const userRoles = res.locals.user.roles || []

  res.locals.showServiceOnboardingBanner =
    !userRoles.includes(ApplicationRoles.ROLE_EDUCATION_WORK_PLAN_EDITOR) &&
    !config.featureToggles.prisonIsEnabledForService(activeCaseloadId)

  next()
}

export default checkWhetherToShowServiceOnboardingBanner
