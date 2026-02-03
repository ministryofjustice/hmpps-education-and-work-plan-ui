import { Router } from 'express'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ViewEmployabilitySkillRatingsController from './viewEmployabilitySkillRatingsController'

const viewEmployabilitySkillRatingsRoutes = (): Router => {
  const viewEmployabilitySkillRatingsController = new ViewEmployabilitySkillRatingsController()

  const router = Router({ mergeParams: true })

  router.get('/', [
    checkUserHasPermissionTo(ApplicationAction.VIEW_EMPLOYABILITY_SKILL_RATINGS),
    asyncMiddleware(viewEmployabilitySkillRatingsController.getEmployabilitySkillRatingsView),
  ])

  return router
}

export default viewEmployabilitySkillRatingsRoutes
