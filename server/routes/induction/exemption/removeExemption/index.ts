import { Router } from 'express'
import { Services } from '../../../../services'
import asyncMiddleware from '../../../../middleware/asyncMiddleware'
import ConfirmExemptionRemovalController from './confirmExemptionRemovalController'
import ExemptionRemovedController from './exemptionRemovedController'
import retrieveInductionSchedule from '../../../routerRequestHandlers/retrieveInductionSchedule'
import checkInductionIsExempt from '../../../routerRequestHandlers/checkInductionIsExempt'
import { checkUserHasPermissionTo } from '../../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../../enums/applicationAction'
import setupJourneyData from '../../../routerRequestHandlers/setupJourneyData'

/**
 * Route definitions to remove the exemption on a prisoner's Induction
 */
export default (services: Services) => {
  const { auditService, inductionService, journeyDataService } = services

  const confirmExemptionRemovalController = new ConfirmExemptionRemovalController(inductionService, auditService)
  const exemptionRemovedController = new ExemptionRemovedController()

  const router = Router({ mergeParams: true })

  router.use([
    checkUserHasPermissionTo(ApplicationAction.REMOVE_INDUCTION_EXEMPTION),
    setupJourneyData(journeyDataService),
  ])

  router.get('/remove', [
    checkInductionIsExempt(inductionService), // Induction Schedule must already be exempt in order to remove the exemption
    retrieveInductionSchedule(inductionService),
    asyncMiddleware(confirmExemptionRemovalController.getConfirmExemptionRemovalView),
  ])
  router.post('/remove', [asyncMiddleware(confirmExemptionRemovalController.submitConfirmExemptionRemoval)])

  router.get('/removed', [
    retrieveInductionSchedule(inductionService),
    asyncMiddleware(exemptionRemovedController.getExemptionRemovedView),
  ])
  router.post('/removed', [asyncMiddleware(exemptionRemovedController.submitExemptionRemoved)])

  return router
}
