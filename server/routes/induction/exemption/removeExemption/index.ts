import { Router } from 'express'
import { Services } from '../../../../services'
import asyncMiddleware from '../../../../middleware/asyncMiddleware'
import ConfirmExemptionRemovalController from './confirmExemptionRemovalController'
import ExemptionRemovedController from './exemptionRemovedController'
import retrieveInductionSchedule from '../../../routerRequestHandlers/retrieveInductionSchedule'
import checkInductionIsExempt from '../../../routerRequestHandlers/checkInductionIsExempt'
import { checkUserHasPermissionTo } from '../../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../../enums/applicationAction'

/**
 * Route definitions to remove the exemption on a prisoner's Induction
 */
export default (router: Router, services: Services) => {
  const { auditService, inductionService } = services

  const confirmExemptionRemovalController = new ConfirmExemptionRemovalController(inductionService, auditService)
  const exemptionRemovedController = new ExemptionRemovedController()

  router.get('/prisoners/:prisonNumber/induction/exemption/remove', [
    checkUserHasPermissionTo(ApplicationAction.REMOVE_INDUCTION_EXEMPTION),
    checkInductionIsExempt(inductionService), // Induction Schedule must already be exempt in order to remove the exemption
    retrieveInductionSchedule(inductionService),
    asyncMiddleware(confirmExemptionRemovalController.getConfirmExemptionRemovalView),
  ])
  router.post('/prisoners/:prisonNumber/induction/exemption/remove', [
    checkUserHasPermissionTo(ApplicationAction.REMOVE_INDUCTION_EXEMPTION),
    asyncMiddleware(confirmExemptionRemovalController.submitConfirmExemptionRemoval),
  ])

  router.get('/prisoners/:prisonNumber/induction/exemption/removed', [
    checkUserHasPermissionTo(ApplicationAction.REMOVE_INDUCTION_EXEMPTION),
    retrieveInductionSchedule(inductionService),
    asyncMiddleware(exemptionRemovedController.getExemptionRemovedView),
  ])
  router.post('/prisoners/:prisonNumber/induction/exemption/removed', [
    checkUserHasPermissionTo(ApplicationAction.REMOVE_INDUCTION_EXEMPTION),
    asyncMiddleware(exemptionRemovedController.submitExemptionRemoved),
  ])
}
