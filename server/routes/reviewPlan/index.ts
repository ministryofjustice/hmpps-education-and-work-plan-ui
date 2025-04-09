import { Router } from 'express'
import { Services } from '../../services'
import completeActionPlanReviewRoutes from './review'
import exemptActionPlanReviewRoutes from './exemption'
import exemptionRemovalActionPlanReviewRoutes from './removeExemption'

/**
 * Route definitions for the review plan journeys
 */
export default function reviewPlanRoutes(router: Router, services: Services) {
  completeActionPlanReviewRoutes(router, services)
  exemptActionPlanReviewRoutes(router, services)
  exemptionRemovalActionPlanReviewRoutes(router, services)
}
