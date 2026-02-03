import { Router } from 'express'
import { type Services } from '../services'
import createGoal from './createGoal'
import updateGoal from './updateGoal'
import overview from './overview'
import functionalSkillsRoutes from './functionalSkills'
import prisonerListRoutes from './prisonerList'
import postInductionCreation from './postInductionCreation'
import exemptInduction from './induction/exemption'
import createInduction from './induction/create'
import updateInduction from './induction/update'
import inPrisonCoursesAndQualifications from './inPrisonCoursesAndQualifications'
import retrievePrisonerSummary from './routerRequestHandlers/retrievePrisonerSummary'
import { checkPageViewAuditted } from '../middleware/auditMiddleware'
import archiveGoal from './archiveGoal'
import unarchiveGoal from './unarchiveGoal'
import completeGoal from './completegoal'
import completeOrArchiveGoal from './completeOrArchive'
import createPrePrisonEducation from './prePrisonEducation/create'
import updatePrePrisonEducation from './prePrisonEducation/update'
import reviewPlanRoutes from './reviewPlan'
import checkPrisonerInCaseload from '../middleware/checkPrisonerInCaseloadMiddleware'
import landingPageRoutes from './landingPage'
import sessionSummaryRoutes from './sessionSummary'
import populateActiveCaseloadPrisonName from './routerRequestHandlers/populateActiveCaseloadPrisonName'
import sessionListRoutes from './sessionList'
import lrsQualificationsRoutes from './lrsQualifications'
import employabilitySkillsRoutes from './employabilitySkills'
import config from '../config'

export default function routes(services: Services): Router {
  const router = Router()

  // Checks page has been audited, if no audit event has been raised router will be skipped
  checkPageViewAuditted(router)

  // Route middleware
  prisonerSummarySetup(router, services)

  router.get(/(.*)/, [populateActiveCaseloadPrisonName(services.prisonService)])

  // Application routes
  inPrisonCoursesAndQualifications(router, services)

  router.use('/plan/:prisonNumber/', [functionalSkillsRoutes(services), lrsQualificationsRoutes(services)])

  if (config.featureToggles.employabilitySkillsEnabled) {
    router.use('/plan/:prisonNumber/employability-skills/:skillType', employabilitySkillsRoutes(services))
  }

  overview(router, services)
  createGoal(router, services)
  updateGoal(router, services)
  archiveGoal(router, services)
  unarchiveGoal(router, services)
  completeGoal(router, services)
  completeOrArchiveGoal(router, services)

  createPrePrisonEducation(router, services)
  updatePrePrisonEducation(router, services)

  // Setup of Induction exemption routes MUST happen before setup of Update Induction routes.
  // The routes share a common path pattern (/prisoners/:prisonNumber/induction), but Update Induction defines a middleware on /prisoners/:prisonNumber/induction/** to ensure the Induction exists - you cannot update an Induction that does not exist!
  // Conversely, exempting an Induction requires that there is NOT an induction, as you cannot exempt an Induction you have already completed.
  exemptInduction(router, services)
  createInduction(router, services)
  updateInduction(router, services)
  postInductionCreation(router, services)

  reviewPlanRoutes(router, services)

  sessionListRoutes(router, services)

  // Landing page route MUST be defined before session summary and prisoner list(search) routes due to the nature of the "forward" within the landing page route
  landingPageRoutes(router)
  sessionSummaryRoutes(router, services)
  prisonerListRoutes(router, services)

  return router
}

// Setup prisoner summary session for routes with prisonNumber param and check the prisoner is in the users caseloads
function prisonerSummarySetup(router: Router, services: Services) {
  router.param('prisonNumber', retrievePrisonerSummary(services.prisonerService))
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
