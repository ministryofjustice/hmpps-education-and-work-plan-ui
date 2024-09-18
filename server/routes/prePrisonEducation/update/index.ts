import { Router } from 'express'
import { Services } from '../../../services'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { checkUserHasEditAuthority } from '../../../middleware/roleBasedAccessControl'
import HighestLevelOfEducationUpdateController from './highestLevelOfEducationUpdateController'
import retrieveEducationForUpdate from '../../routerRequestHandlers/retrieveEducationForUpdate'

/**
 * Route definitions for updating a prisoner's qualifications
 *
 */
export default (router: Router, services: Services) => {
  const { educationAndWorkPlanService } = services
  const highestLevelOfEducationUpdateController = new HighestLevelOfEducationUpdateController(
    educationAndWorkPlanService,
  )

  router.use('/prisoners/:prisonNumber/education/highest-level-of-education', [
    checkUserHasEditAuthority(),
    retrieveEducationForUpdate(educationAndWorkPlanService),
  ])
  router.get('/prisoners/:prisonNumber/education/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationUpdateController.getHighestLevelOfEducationView),
  ])
  router.post('/prisoners/:prisonNumber/education/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationUpdateController.submitHighestLevelOfEducationForm),
  ])
}
