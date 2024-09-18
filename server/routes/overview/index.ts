import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import OverviewController from './overviewController'
import retrieveCuriousInPrisonCourses from '../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import removeInductionFormsFromSession from '../routerRequestHandlers/removeInductionFormsFromSession'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import TimelineController from './timelineController'
import SupportNeedsController from './supportNeedsController'
import WorkAndInterestsController from './workAndInterestsController'
import EducationAndTrainingController from './educationAndTrainingController'
import retrieveInduction from '../routerRequestHandlers/retrieveInduction'
import ViewArchivedGoalsController from './viewArchivedGoalsController'
import retrieveEducation from '../routerRequestHandlers/retrieveEducation'
import retrieveGoals from '../routerRequestHandlers/retrieveGoals'
import GoalStatusValue from '../../enums/goalStatusValue'

/**
 * Route definitions for the pages relating to the main Overview page
 */
export default (router: Router, services: Services) => {
  const overViewController = new OverviewController(services.curiousService, services.inductionService)

  const timelineController = new TimelineController(services.timelineService)
  const supportNeedsController = new SupportNeedsController(services.curiousService, services.prisonService)
  const workAndInterestsController = new WorkAndInterestsController()
  const educationAndTrainingController = new EducationAndTrainingController(services.curiousService)
  const viewArchivedGoalsController = new ViewArchivedGoalsController(services.educationAndWorkPlanService)

  router.use('/plan/:prisonNumber/view/*', [checkUserHasViewAuthority(), removeInductionFormsFromSession])

  router.get('/plan/:prisonNumber/view/overview', [
    retrieveCuriousInPrisonCourses(services.curiousService),
    retrieveGoals(services.educationAndWorkPlanService, GoalStatusValue.ACTIVE),
    asyncMiddleware(overViewController.getOverviewView),
  ])

  router.get('/plan/:prisonNumber/view/support-needs', [asyncMiddleware(supportNeedsController.getSupportNeedsView)])

  router.get('/plan/:prisonNumber/view/education-and-training', [
    retrieveCuriousInPrisonCourses(services.curiousService),
    retrieveInduction(services.inductionService),
    retrieveEducation(services.educationAndWorkPlanService),
    asyncMiddleware(educationAndTrainingController.getEducationAndTrainingView),
  ])

  router.get('/plan/:prisonNumber/view/work-and-interests', [
    retrieveInduction(services.inductionService),
    asyncMiddleware(workAndInterestsController.getWorkAndInterestsView),
  ])

  router.get('/plan/:prisonNumber/view/timeline', [asyncMiddleware(timelineController.getTimelineView)])

  router.get('/plan/:prisonNumber/view/archived-goals', [
    asyncMiddleware(viewArchivedGoalsController.viewArchivedGoals),
  ])
}
