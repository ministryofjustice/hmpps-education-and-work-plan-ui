import authorisationMiddleware from './authorisationMiddleware'

enum ApplicationRoles {
  ROLE_EDUCATION_WORK_PLAN_EDITOR = 'ROLE_EDUCATION_WORK_PLAN_EDITOR',
}

enum DpsRoles {
  ROLE_GLOBAL_SEARCH = 'ROLE_GLOBAL_SEARCH',
  ROLE_INACTIVE_BOOKINGS = 'ROLE_INACTIVE_BOOKINGS',
  ROLE_POM = 'ROLE_POM',
}

const checkUserHasEditAuthority = () => authorisationMiddleware([ApplicationRoles.ROLE_EDUCATION_WORK_PLAN_EDITOR])

export { ApplicationRoles, DpsRoles, checkUserHasEditAuthority }
