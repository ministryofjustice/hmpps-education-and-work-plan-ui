import authorisationMiddleware from './authorisationMiddleware'
import ApplicationAction from '../enums/applicationAction'
import DpsRole from '../enums/dpsRole'

/**
 * A map of [ApplicationAction] to [DpsRole]s, to determine which role is required for any given action.
 * The list of [ApplicationRole]s should be considered an "or" list. Users require any one of the listed roles for each
 * action.
 */
const rolesForAction: Record<ApplicationAction, Array<DpsRole>> = {
  [ApplicationAction.RECORD_INDUCTION]: [DpsRole.ROLE_LWP_MANAGER],
  [ApplicationAction.EXEMPT_INDUCTION]: [DpsRole.ROLE_LWP_MANAGER],
  [ApplicationAction.REMOVE_INDUCTION_EXEMPTION]: [DpsRole.ROLE_LWP_MANAGER],
  [ApplicationAction.UPDATE_INDUCTION]: [DpsRole.ROLE_LWP_MANAGER, DpsRole.ROLE_LWP_CONTRIBUTOR],
  [ApplicationAction.RECORD_EDUCATION]: [DpsRole.ROLE_LWP_MANAGER, DpsRole.ROLE_LWP_CONTRIBUTOR],
  [ApplicationAction.UPDATE_EDUCATION]: [DpsRole.ROLE_LWP_MANAGER, DpsRole.ROLE_LWP_CONTRIBUTOR],
  [ApplicationAction.RECORD_REVIEW]: [DpsRole.ROLE_LWP_MANAGER],
  [ApplicationAction.EXEMPT_REVIEW]: [DpsRole.ROLE_LWP_MANAGER],
  [ApplicationAction.REMOVE_REVIEW_EXEMPTION]: [DpsRole.ROLE_LWP_MANAGER],
  [ApplicationAction.CREATE_GOALS]: [DpsRole.ROLE_LWP_MANAGER],
  [ApplicationAction.UPDATE_GOALS]: [DpsRole.ROLE_LWP_MANAGER],
  [ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS]: [DpsRole.ROLE_LWP_MANAGER],
  [ApplicationAction.VIEW_SESSION_SUMMARIES]: [DpsRole.ROLE_LWP_MANAGER],
  [ApplicationAction.VIEW_EMPLOYABILITY_SKILLS]: [],
  [ApplicationAction.ADD_EMPLOYABILITY_SKILLS_RATING]: [],
  [ApplicationAction.VIEW_EMPLOYABILITY_SKILL_RATINGS]: [],
  [ApplicationAction.USE_DPS_LEARNER_RECORD_MATCHING_SERVICE]: [DpsRole.ROLE_MATCH_LEARNER_RECORD_RW],
}

/**
 * A convenience middleware function that uses [authorisationMiddleware] to grant or deny access to a given
 * [ApplicationAction] based on the user's roles.
 */
const checkUserHasPermissionTo = (action: ApplicationAction) => authorisationMiddleware(rolesForAction[action])

/**
 * Returns true if the specified [ApplicationAction] can be satisfied with any of the specified user roles.
 */
const userHasPermissionTo = (action: ApplicationAction, userRoles: string[]): boolean => {
  const requiredRoles = rolesForAction[action] || []
  return requiredRoles.length === 0 || userRoles.some(role => requiredRoles.includes(role as DpsRole))
}

/**
 * Helper method to return an array of [ApplicationAction] for a given [DpsRole] that a user might have.
 */
const userWithRoleCan = (role: DpsRole): Array<ApplicationAction> =>
  Object.values(ApplicationAction).filter(
    action => rolesForAction[action].length === 0 || rolesForAction[action].includes(role),
  )

export { checkUserHasPermissionTo, userHasPermissionTo, userWithRoleCan }
