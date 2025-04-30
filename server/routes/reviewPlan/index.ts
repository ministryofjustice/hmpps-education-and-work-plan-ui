import { Router } from 'express'
import { Services } from '../../services'
import completeActionPlanReviewRoutes from './review'
import exemptActionPlanReviewRoutes from './exemption'
import exemptionRemovalActionPlanReviewRoutes from './removeExemption'
import insertJourneyIdentifier from '../routerRequestHandlers/insertJourneyIdentifier'

/**
 * Route definitions for the review plan journeys
 */
export default function reviewPlanRoutes(router: Router, services: Services) {
  router.use('/plan/:prisonNumber/review', [
    insertJourneyIdentifier({ insertIdAfterElement: 2 }), // insert journey ID immediately after '/prisoners/:prisonNumber' - eg: '/prisoners/A1234BC/473e9ee4-37d6-4afb-92a2-5729b10cc60f/review'
  ])

  router.use('/plan/:prisonNumber/:journeyId/review', [
    completeActionPlanReviewRoutes(services),
    exemptActionPlanReviewRoutes(services),
    exemptionRemovalActionPlanReviewRoutes(services),
  ])
}
