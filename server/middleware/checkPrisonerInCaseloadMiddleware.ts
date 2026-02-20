import createError from 'http-errors'
import { RequestHandler } from 'express'
import DpsRole from '../enums/dpsRole'
import { userHasRoles } from '../utils/userRoles'
import { isActiveCaseLoad, isInUsersCaseLoad } from '../utils/userCaseLoads'

export default function checkPrisonerInCaseload({
  allowGlobal = true,
  allowGlobalPom = true,
  allowInactive = true,
  activeCaseloadOnly = false,
} = {}): RequestHandler {
  return async (req, res, next) => {
    const { prisonerSummary } = res.locals
    const userRoles: string[] = res.locals.user.userRoles || []

    // This function requires the prisoner summary - so ensure that's present before continuing
    if (!prisonerSummary) {
      return next(createError(500, 'CheckPrisonerInCaseloadMiddleware: No PrisonerSummary found on res.locals'))
    }

    const { restrictedPatient } = prisonerSummary
    const inactiveBooking = ['OUT', 'TRN'].some(prisonId => prisonId === prisonerSummary.prisonId)
    const globalSearchUser = userHasRoles([DpsRole.ROLE_GLOBAL_SEARCH], userRoles)
    const inactiveBookingsUser = userHasRoles([DpsRole.ROLE_INACTIVE_BOOKINGS], userRoles)
    const pomUser = userHasRoles([DpsRole.ROLE_POM], userRoles)

    /*
     * Restricted patients can be accessed by:
     * - POM users who have the supporting prison ID in their case loads
     * - Users with the inactive bookings role
     */
    function authenticateRestrictedPatient() {
      return (pomUser && isInUsersCaseLoad(prisonerSummary.supportingPrisonId, res.locals.user)) || inactiveBookingsUser
    }

    // Prisoners with a caseload of OUT can only be accessed by people who have the inactive bookings role
    function authenticateOut() {
      return allowInactive && inactiveBookingsUser
    }

    // Prisoners with a caseload of TRN (transferring) can be accessed by people with global search or inactive bookings
    function authenticateTransfer() {
      const allowedToViewTransfers = globalSearchUser || inactiveBookingsUser
      return allowInactive && allowedToViewTransfers
    }

    /*
     * Prisoners can only be accessed if they are within your caseload
     * OR
     * You are a global search user and the route is able to be accessed globally
     */
    function authenticateActiveBooking() {
      if (isInUsersCaseLoad(prisonerSummary.prisonId, res.locals.user)) {
        return true
      }

      return (allowGlobal && globalSearchUser) || (allowGlobalPom && pomUser && globalSearchUser)
    }

    // Some routes can only be accessed if the prisoner is within your active caseload
    function authenticateActiveCaseloadOnly() {
      return isActiveCaseLoad(prisonerSummary.prisonId, res.locals.user)
    }

    if (activeCaseloadOnly && !authenticateActiveCaseloadOnly()) {
      return next(createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner not in active caseload'))
    }

    if (restrictedPatient) {
      if (!authenticateRestrictedPatient()) {
        return next(createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner is restricted patient'))
      }
    } else if (inactiveBooking) {
      if (prisonerSummary.prisonId === 'OUT' && !authenticateOut()) {
        return next(
          createError(404, `CheckPrisonerInCaseloadMiddleware: Prisoner is inactive [${prisonerSummary.prisonId}]`),
        )
      }
      if (prisonerSummary.prisonId === 'TRN' && !authenticateTransfer()) {
        return next(
          createError(404, `CheckPrisonerInCaseloadMiddleware: Prisoner is inactive [${prisonerSummary.prisonId}]`),
        )
      }
    } else if (!authenticateActiveBooking()) {
      return next(createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner not in caseloads'))
    }

    return next()
  }
}
