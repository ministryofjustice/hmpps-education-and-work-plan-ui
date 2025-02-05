import { RequestHandler } from 'express'
import { jwtDecode } from 'jwt-decode'
import ApplicationRole from '../enums/applicationRole'
import ApplicationAction from '../enums/applicationAction'
import { userHasPermissionTo } from './roleBasedAccessControl'

export default function populateUserAuthorities(): RequestHandler {
  return async (req, res, next) => {
    if (res.locals?.user?.token) {
      const { authorities: roles = [] } = jwtDecode(res.locals.user.token) as { authorities?: string[] }

      // hasEditAuthority is deprecated - use userHasPermissionTo instead
      res.locals.hasEditAuthority = roles.includes(ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR)

      res.locals.userHasPermissionTo = (action: ApplicationAction) => userHasPermissionTo(action, roles)
    }

    next()
  }
}
