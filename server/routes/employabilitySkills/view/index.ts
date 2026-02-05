import { Router } from 'express'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ViewEmployabilitySkillRatingsController from './viewEmployabilitySkillRatingsController'
import retrieveEmployabilitySkills from '../../routerRequestHandlers/retrieveEmployabilitySkills'
import { Services } from '../../../services'
import retrievePrisonNamesById from '../../routerRequestHandlers/retrievePrisonNamesById'

const viewEmployabilitySkillRatingsRoutes = (services: Services): Router => {
  const { employabilitySkillsService, prisonService } = services
  const viewEmployabilitySkillRatingsController = new ViewEmployabilitySkillRatingsController()

  const router = Router({ mergeParams: true })

  router.get('/', [
    checkUserHasPermissionTo(ApplicationAction.VIEW_EMPLOYABILITY_SKILL_RATINGS),
    retrieveEmployabilitySkills(employabilitySkillsService),
    retrievePrisonNamesById(prisonService),
    asyncMiddleware(viewEmployabilitySkillRatingsController.getEmployabilitySkillRatingsView),
  ])

  return router
}

export default viewEmployabilitySkillRatingsRoutes
