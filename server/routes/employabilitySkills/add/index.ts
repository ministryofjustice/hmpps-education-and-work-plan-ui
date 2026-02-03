import { Router } from 'express'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../routerRequestHandlers/insertJourneyIdentifier'
import { Services } from '../../../services'
import setupJourneyData from '../../routerRequestHandlers/setupJourneyData'
import AddEmployabilitySkillRatingsController from './addEmployabilitySkillRatingsController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'

const addEmployabilitySkillRatingsRoutes = (services: Services): Router => {
  const { journeyDataService } = services

  const addEmployabilitySkillRatingsController = new AddEmployabilitySkillRatingsController()

  const router = Router({ mergeParams: true })

  router.use('/add', [
    checkUserHasPermissionTo(ApplicationAction.ADD_EMPLOYABILITY_SKILLS_RATING),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }), // insert journey ID between the skill type and /add - eg: '/plan/A1234BC/employability-skills/PROBLEM_SOLVING/473e9ee4-37d6-4afb-92a2-5729b10cc60f/add'
  ])

  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get(
    '/:journeyId/add',
    asyncMiddleware(addEmployabilitySkillRatingsController.getEmployabilitySkillRatingsView),
  )
  router.post(
    '/:journeyId/add',
    asyncMiddleware(addEmployabilitySkillRatingsController.submitEmployabilitySkillRatingsForm),
  )

  return router
}

export default addEmployabilitySkillRatingsRoutes
