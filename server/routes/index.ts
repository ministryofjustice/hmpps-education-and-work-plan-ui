import { Router } from 'express'
import { type Services } from '../services'
import createGoal from './createGoal'
import updateGoal from './updateGoal'
import overview from './overview'
import functionalSkills from './functionalSkills'
import prisonerList from './prisonerList'
import postInductionCreation from './postInductionCreation'
import createInduction from './induction/create'
import updateInduction from './induction/update'
import inPrisonCoursesAndQualifications from './inPrisonCoursesAndQualifications'
import retrievePrisonerSummaryIfNotInSession from './routerRequestHandlers/retrievePrisonerSummaryIfNotInSession'

export default function routes(services: Services): Router {
  const router = Router()

  // Route middleware
  prisonerSummarySetup(router, services)

  // Application routes
  inPrisonCoursesAndQualifications(router, services)
  functionalSkills(router, services)

  overview(router, services)
  createGoal(router, services)
  updateGoal(router, services)

  createInduction(router, services)
  updateInduction(router, services)
  postInductionCreation(router, services)

  prisonerList(router, services)

  return router
}

// Setup prisoner summary session for routes with prisonNumber param
function prisonerSummarySetup(router: Router, services: Services) {
  router.param('prisonNumber', retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService))
}
