import authorisationMiddleware from './authorisationMiddleware'
import ApplicationRole from '../enums/applicationRole'
import ApplicationAction from '../enums/applicationAction'

/**
 * Deprecated - use `checkUserHasPermissionTo` instead
 */
const checkUserHasEditAuthority = () => authorisationMiddleware([ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR])

/**
 * A map of [ApplicationAction] to [ApplicationRole]s, to determine which role is required for any given action.
 * The list of [ApplicationRole]s should be considered an "or" list. Users require any one of the listed roles for each
 * action.
 */
const rolesForAction = {
  [ApplicationAction.RECORD_INDUCTION]: [
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER,
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR,
    ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR,
  ],
  [ApplicationAction.EXEMPT_INDUCTION]: [
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER,
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR,
    ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR,
  ],
  [ApplicationAction.REMOVE_INDUCTION_EXEMPTION]: [
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER,
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR,
    ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR,
  ],
  [ApplicationAction.UPDATE_INDUCTION]: [
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER,
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR,
    ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR,
  ],
  [ApplicationAction.RECORD_REVIEW]: [
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER,
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR,
    ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR,
  ],
  [ApplicationAction.EXEMPT_REVIEW]: [
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER,
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR,
    ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR,
  ],
  [ApplicationAction.REMOVE_REVIEW_EXEMPTION]: [
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER,
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR,
    ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR,
  ],
  [ApplicationAction.CREATE_GOALS]: [
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER,
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR,
    ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR,
  ],
  [ApplicationAction.UPDATE_GOALS]: [
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER,
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR,
    ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR,
  ],
  [ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS]: [
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER,
    ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR,
    ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR,
  ],
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
  return userRoles.some(role => (rolesForAction[action] || []).includes(role as ApplicationRole))
}

/**
 * Helper method to return an array of [ApplicationAction] for a given [ApplicationRole] that a user might have.
 */
const userWithRoleCan = (role: ApplicationRole): Array<ApplicationAction> =>
  Object.keys(ApplicationAction)
    .filter(action => rolesForAction[action as ApplicationAction].includes(role))
    .map(action => action as ApplicationAction)

export { checkUserHasEditAuthority, checkUserHasPermissionTo, userHasPermissionTo, userWithRoleCan }
