/**
 * Module containing utility functions to do with user roles
 */

/**
 * Whether any of the roles exist for the given user allowing for conditional role based access on any number of roles
 */

export function userHasRoles(rolesToCheck: string[], userRoles: string[]): boolean {
  const normaliseRoleText = (role: string): string => role.replace(/ROLE_/, '')
  return rolesToCheck.map(normaliseRoleText).some(role => userRoles.map(normaliseRoleText).includes(role))
}

/**
 * Whether all of the roles exist for the given user allowing for conditional role based access on any number of roles
 */
export function userHasAllRoles(rolesToCheck: string[], userRoles: string[]): boolean {
  return rolesToCheck.every(role => userRoles.includes(role))
}
