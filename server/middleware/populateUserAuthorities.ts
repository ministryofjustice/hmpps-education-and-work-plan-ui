import { RequestHandler } from 'express'
import jwtDecode from 'jwt-decode'
import { ApplicationRoles } from './roleBasedAccessControl'

export default function populateUserAuthorities(): RequestHandler {
  return async (req, res, next) => {
    if (res.locals?.user?.token) {
      const { authorities: roles = [] } = jwtDecode(res.locals.user.token) as { authorities?: string[] }

      res.locals.hasEditAuthority = roles.includes(ApplicationRoles.ROLE_EDUCATION_WORK_PLAN_EDITOR)
      res.locals.hasViewAuthority =
        roles.includes(ApplicationRoles.ROLE_EDUCATION_WORK_PLAN_EDITOR) ||
        roles.includes(ApplicationRoles.ROLE_EDUCATION_WORK_PLAN_VIEWER)
    }

    next()
  }
}
