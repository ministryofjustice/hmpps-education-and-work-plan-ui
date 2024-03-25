import type { Router } from 'express'
import config from '../../config'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import InPrisonCoursesAndQualificationsController from './inPrisonCoursesAndQualificationsController'
import retrieveCuriousInPrisonCourses from '../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import retrievePrisonerSummaryIfNotInSession from '../routerRequestHandlers/retrievePrisonerSummaryIfNotInSession'

/**
 * Route definitions for the pages relating to In Prison Courses & Qualifications
 */
export default (router: Router, services: Services) => {
  const inPrisonCoursesAndQualificationsController = new InPrisonCoursesAndQualificationsController()

  if (config.featureToggles.newCourseAndQualificationHistoryEnabled) {
    router.get('/plan/:prisonNumber/in-prison-courses-and-qualifications', [
      checkUserHasViewAuthority(),
      retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
      retrieveCuriousInPrisonCourses(services.curiousService),
      inPrisonCoursesAndQualificationsController.getInPrisonCoursesAndQualificationsView,
    ])
  }
}
