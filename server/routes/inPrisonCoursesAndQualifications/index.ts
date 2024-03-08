import type { Router } from 'express'
import config from '../../config'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import { retrievePrisonerSummaryIfNotInSession } from '../routerRequestHandlers'
import InPrisonCoursesAndQualificationsController from './inPrisonCoursesAndQualificationsController'

/**
 * Route definitions for the pages relating to In Prison Courses & Qualifications
 */
export default (router: Router, services: Services) => {
  const inPrisonCoursesAndQualificationsController = new InPrisonCoursesAndQualificationsController(
    services.curiousService,
    services.prisonService,
  )

  if (config.featureToggles.newCourseAndQualificationHistoryEnabled) {
    router.get('/plan/:prisonNumber/in-prison-courses-and-qualifications', [
      checkUserHasViewAuthority(),
      retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
      inPrisonCoursesAndQualificationsController.getInPrisonCoursesAndQualificationsView,
    ])
  }
}
