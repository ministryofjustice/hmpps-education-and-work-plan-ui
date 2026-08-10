import { Request, Router } from 'express'
import { PrisonerBasePermission, prisonerPermissionsGuard } from '@ministryofjustice/hmpps-prison-permissions-lib'
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
import {
  plpUserInPrisonCoursesAndQualifications,
  dpsUserInPrisonCoursesAndQualifications,
} from './inPrisonCoursesAndQualifications'
import retrievePrisonerSummary from './routerRequestHandlers/retrievePrisonerSummary'
import { checkPageViewAudited } from '../middleware/auditMiddleware'
import archiveGoal from './archiveGoal'
import unarchiveGoal from './unarchiveGoal'
import completeGoal from './completegoal'
import completeOrArchiveGoal from './completeOrArchive'
import createPrePrisonEducation from './prePrisonEducation/create'
import updatePrePrisonEducation from './prePrisonEducation/update'
import reviewPlanRoutes from './reviewPlan'
import landingPageRoutes from './landingPage'
import sessionSummaryRoutes from './sessionSummary'
import populateActiveCaseloadPrisonName from './routerRequestHandlers/populateActiveCaseloadPrisonName'
import sessionListRoutes from './sessionList'
import lrsQualificationsRoutes from './lrsQualifications'
import employabilitySkillsRoutes from './employabilitySkills'
import { forAllGetRequests } from '../middleware/requestMatchers'

export default function routes(services: Services): Router {
  const router = Router()

  // Checks page has been audited, if no audit event has been raised router will be skipped
  checkPageViewAudited(router)

  // Route middleware
  prisonerSummarySetup(router, services)

  router.use(forAllGetRequests(populateActiveCaseloadPrisonName(services.prisonService)))

  // Application routes
  router.use('/prisoner/:prisonNumber', [dpsUserInPrisonCoursesAndQualifications(services)])

  router.use('/plan/:prisonNumber', [
    overview(services),
    employabilitySkillsRoutes(services),
    functionalSkillsRoutes(services),
    lrsQualificationsRoutes(services),
    plpUserInPrisonCoursesAndQualifications(services),
    postInductionCreation(services),
    // Goals routes
    createGoal(services),
    updateGoal(services),
    archiveGoal(services),
    unarchiveGoal(services),
    completeGoal(services),
    completeOrArchiveGoal(services),
    // Review routes
    reviewPlanRoutes(services),
  ])
  router.use('/prisoners/:prisonNumber', [
    // Setup of Induction exemption routes MUST happen before setup of Update Induction routes.
    // The routes share a common path pattern (/prisoners/:prisonNumber/induction), but Update Induction defines a middleware on /prisoners/:prisonNumber/induction/** to ensure the Induction exists - you cannot update an Induction that does not exist!
    // Conversely, exempting an Induction requires that there is NOT an induction, as you cannot exempt an Induction you have already completed.
    exemptInduction(services),
    createInduction(services),
    updateInduction(services),
    // Pre-prison education routes
    createPrePrisonEducation(services),
    updatePrePrisonEducation(services),
  ])

  router.use('/sessions', sessionListRoutes(services))

  // Landing page route MUST be defined before session summary and prisoner list(search) routes due to the nature of the "forward" within the landing page route
  router.use('/', landingPageRoutes())
  router.use('/sessions', sessionSummaryRoutes(services))
  router.use('/search', prisonerListRoutes(services))

  return router
}

// Setup prisoner summary session for routes with prisonNumber param and check the prisoner is in the users caseloads
function prisonerSummarySetup(router: Router, services: Services) {
  router.param('prisonNumber', retrievePrisonerSummary(services.prisonerService))
  router.param(
    'prisonNumber',
    prisonerPermissionsGuard(services.prisonPermissionsService, {
      requestDependentOn: [PrisonerBasePermission.read],
      getPrisonerNumberFunction: (req: Request) => req.params.prisonNumber,
    }),
  )
}
