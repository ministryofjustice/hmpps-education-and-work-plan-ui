import authorisationMiddleware from './authorisationMiddleware'

enum ApplicationRoles {
  ROLE_EDUCATION_WORK_PLAN_EDITOR = 'ROLE_EDUCATION_WORK_PLAN_EDITOR',
  ROLE_EDUCATION_WORK_PLAN_VIEWER = 'ROLE_EDUCATION_WORK_PLAN_VIEWER',
}

const checkUserHasEditAuthority = () => authorisationMiddleware([ApplicationRoles.ROLE_EDUCATION_WORK_PLAN_EDITOR])

const checkUserHasViewAuthority = () =>
  authorisationMiddleware([
    ApplicationRoles.ROLE_EDUCATION_WORK_PLAN_EDITOR,
    ApplicationRoles.ROLE_EDUCATION_WORK_PLAN_VIEWER,
  ])

export { ApplicationRoles, checkUserHasEditAuthority, checkUserHasViewAuthority }
