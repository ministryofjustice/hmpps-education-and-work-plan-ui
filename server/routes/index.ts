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
import retrievePrisonerSummary from './routerRequestHandlers/retrievePrisonerSummary'
import { checkPageViewAuditted } from '../middleware/auditMiddleware'
import notesRoutes from './notes'
import archiveGoal from './archiveGoal'
import unarchiveGoal from './unarchiveGoal'
import completeGoal from './completegoal'
import completeOrArchiveGoal from './completeOrArchive'
import createPrePrisonEducation from './prePrisonEducation/create'
import updatePrePrisonEducation from './prePrisonEducation/update'
import reviewPlanRoutes from './reviewPlan'
import checkPrisonerInCaseload from '../middleware/checkPrisonerInCaseloadMiddleware'

export default function routes(services: Services): Router {
  const router = Router()

  // Checks page has been audited, if no audit event has been raised router will be skipped
  checkPageViewAuditted(router)

  // Route middleware
  prisonerSummarySetup(router, services)

  // Application routes
  inPrisonCoursesAndQualifications(router, services)
  functionalSkills(router, services)

  overview(router, services)
  createGoal(router, services)
  updateGoal(router, services)
  archiveGoal(router, services)
  unarchiveGoal(router, services)
  completeGoal(router, services)
  completeOrArchiveGoal(router, services)

  createPrePrisonEducation(router, services)
  updatePrePrisonEducation(router, services)

  createInduction(router, services)
  updateInduction(router, services)
  postInductionCreation(router, services)

  router.use('/plan/:prisonNumber/notes', notesRoutes())

  prisonerList(router, services)

  reviewPlanRoutes(router)

  return router
}

// Setup prisoner summary session for routes with prisonNumber param and check the prisoner is in the users caseloads
function prisonerSummarySetup(router: Router, services: Services) {
  router.param('prisonNumber', retrievePrisonerSummary(services.prisonerSearchService))
  router.param(
    'prisonNumber',
    checkPrisonerInCaseload({
      allowGlobal: true,
      allowGlobalPom: true,
      allowInactive: true,
      activeCaseloadOnly: false,
    }),
  )
}
