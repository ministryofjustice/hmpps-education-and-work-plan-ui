import type { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import InPrisonCoursesAndQualificationsController from './inPrisonCoursesAndQualificationsController'
import retrieveCuriousInPrisonCourses from '../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Route definitions for the pages relating to In Prison Courses & Qualifications
 *
 * There are two routes for essentially the same page:
 *   * PLP route - /plan/:prisonNumber/in-prison-courses-and-qualifications
 *   * DPS route - /prisoner/:prisonNumber/work-and-skills/in-prison-courses-and-qualifications
 *
 * Whilst both routes render the same data, the routes have different security requirements. The PLP route requires that
 * the user is a PLP user (has a PLP role), whereas the DPS route uses the user's caseloads.
 *
 * There are subtle differences in the rendered view as well, with the PLP view using terms such as "learning plan" and
 * linking to other PLP pages, and the DPS view linking back to the prisoner's DPS profile page.
 */
export default (router: Router, services: Services) => {
  const inPrisonCoursesAndQualificationsController = new InPrisonCoursesAndQualificationsController()

  // Route for use when being linked to from within PLP within the context of a prisoner's PLP plan
  router.get('/plan/:prisonNumber/in-prison-courses-and-qualifications', [
    checkUserHasViewAuthority(),
    retrieveCuriousInPrisonCourses(services.curiousService),
    asyncMiddleware(inPrisonCoursesAndQualificationsController.getInPrisonCoursesAndQualificationsViewForPlp),
  ])

  // Route for use when being linked to from DPS Prisoner Profile within the context of a prisoner's Work and Skills section of their Prisoner Profile
  router.get('/prisoner/:prisonNumber/work-and-skills/in-prison-courses-and-qualifications', [
    retrieveCuriousInPrisonCourses(services.curiousService),
    asyncMiddleware(inPrisonCoursesAndQualificationsController.getInPrisonCoursesAndQualificationsViewForDps),
  ])
}
