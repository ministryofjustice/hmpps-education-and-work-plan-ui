import { NextFunction, Request, Response, Router } from 'express'
import createError from 'http-errors'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../enums/applicationAction'
import EmployabilitySkillsController from './employabilitySkillsController'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import EmployabilitySkillsValue from '../../enums/employabilitySkillsValue'

const employabilitySkillsRoutes = (): Router => {
  const employabilitySkillsController = new EmployabilitySkillsController()

  const router = Router({ mergeParams: true })

  router.use('/', async (req: Request, res: Response, next: NextFunction) => {
    const { skillType } = req.params
    if (Object.keys(EmployabilitySkillsValue).includes(skillType)) {
      return next()
    }
    return next(createError(404, `Unknown employability skill type ${skillType}`))
  })

  router.get('/', [
    checkUserHasPermissionTo(ApplicationAction.VIEW_EMPLOYABILITY_SKILL_RATINGS),
    asyncMiddleware(employabilitySkillsController.getEmployabilitySkillRatingsView),
  ])

  return router
}

export default employabilitySkillsRoutes
