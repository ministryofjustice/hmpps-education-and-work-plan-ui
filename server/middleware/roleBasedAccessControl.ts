import authorisationMiddleware from './authorisationMiddleware'
import ApplicationRole from '../enums/applicationRole'
import ApplicationAction from '../enums/applicationAction'

/**
 * A map of [ApplicationAction] to [ApplicationRole]s, to determine which role is required for any given action.
 * The list of [ApplicationRole]s should be considered an "or" list. Users require any one of the listed roles for each
 * action.
 */
const rolesForAction = () => ({
  [ApplicationAction.RECORD_INDUCTION]: [ApplicationRole.ROLE_LWP_MANAGER],
  [ApplicationAction.EXEMPT_INDUCTION]: [ApplicationRole.ROLE_LWP_MANAGER],
  [ApplicationAction.REMOVE_INDUCTION_EXEMPTION]: [ApplicationRole.ROLE_LWP_MANAGER],
  [ApplicationAction.UPDATE_INDUCTION]: [ApplicationRole.ROLE_LWP_MANAGER, ApplicationRole.ROLE_LWP_CONTRIBUTOR],
  [ApplicationAction.RECORD_EDUCATION]: [ApplicationRole.ROLE_LWP_MANAGER, ApplicationRole.ROLE_LWP_CONTRIBUTOR],
  [ApplicationAction.UPDATE_EDUCATION]: [ApplicationRole.ROLE_LWP_MANAGER, ApplicationRole.ROLE_LWP_CONTRIBUTOR],
  [ApplicationAction.RECORD_REVIEW]: [ApplicationRole.ROLE_LWP_MANAGER],
  [ApplicationAction.EXEMPT_REVIEW]: [ApplicationRole.ROLE_LWP_MANAGER],
  [ApplicationAction.REMOVE_REVIEW_EXEMPTION]: [ApplicationRole.ROLE_LWP_MANAGER],
  [ApplicationAction.CREATE_GOALS]: [ApplicationRole.ROLE_LWP_MANAGER],
  [ApplicationAction.UPDATE_GOALS]: [ApplicationRole.ROLE_LWP_MANAGER],
  [ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS]: [ApplicationRole.ROLE_LWP_MANAGER],
  [ApplicationAction.VIEW_SESSION_SUMMARIES]: [ApplicationRole.ROLE_LWP_MANAGER],
})

/**
 * A convenience middleware function that uses [authorisationMiddleware] to grant or deny access to a given
 * [ApplicationAction] based on the user's roles.
 */
const checkUserHasPermissionTo = (action: ApplicationAction) => authorisationMiddleware(rolesForAction()[action])

/**
 * Returns true if the specified [ApplicationAction] can be satisfied with any of the specified user roles.
 */
const userHasPermissionTo = (action: ApplicationAction, userRoles: string[]): boolean => {
  return userRoles.some(role => (rolesForAction()[action] || []).includes(role as ApplicationRole))
}

/**
 * Helper method to return an array of [ApplicationAction] for a given [ApplicationRole] that a user might have.
 */
const userWithRoleCan = (role: ApplicationRole): Array<ApplicationAction> =>
  Object.keys(ApplicationAction)
    .filter(action => rolesForAction()[action as ApplicationAction].includes(role))
    .map(action => action as ApplicationAction)

export { checkUserHasPermissionTo, userHasPermissionTo, userWithRoleCan }
