import { Router } from 'express'
import { Services } from '../../../../services'
import asyncMiddleware from '../../../../middleware/asyncMiddleware'
import createEmptyInductionExemptionDtoIfNotInPrisonerContext from '../../../routerRequestHandlers/createEmptyInductionExemptionDtoIfNotInPrisonerContext'
import ExemptionReasonController from './exemptionReasonController'
import ConfirmExemptionController from './confirmExemptionController'
import checkInductionExemptionDtoExistsInPrisonerContext from '../../../routerRequestHandlers/checkInductionExemptionDtoExistsInPrisonerContext'
import retrieveInductionSchedule from '../../../routerRequestHandlers/retrieveInductionSchedule'
import ExemptionRecordedController from './exemptionRecordedController'
import checkInductionIsScheduled from '../../../routerRequestHandlers/checkInductionIsScheduled'
import { checkUserHasPermissionTo } from '../../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../../enums/applicationAction'

/**
 * Route definitions for exempting a prisoner's Induction
 */
export default (services: Services) => {
  const { auditService, inductionService } = services

  const exemptionReasonController = new ExemptionReasonController()
  const confirmExemptionController = new ConfirmExemptionController(inductionService, auditService)
  const exemptionRecordedController = new ExemptionRecordedController()

  const router = Router({ mergeParams: true })

  router.use([checkUserHasPermissionTo(ApplicationAction.EXEMPT_INDUCTION)])

  router.get('/', [
    checkInductionIsScheduled(inductionService), // Induction Schedule must be SCHEDULED in order to exempt it
    createEmptyInductionExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.getExemptionReasonView),
  ])
  router.post('/', [
    createEmptyInductionExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.submitExemptionReasonForm),
  ])

  router.get('/confirm', [
    checkInductionExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(confirmExemptionController.getConfirmExemptionView),
  ])
  router.post('/confirm', [
    checkInductionExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(confirmExemptionController.submitConfirmExemption),
  ])

  router.get('/recorded', [
    checkInductionExemptionDtoExistsInPrisonerContext,
    retrieveInductionSchedule(inductionService),
    asyncMiddleware(exemptionRecordedController.getExemptionRecordedView),
  ])
  router.post('/recorded', [
    checkInductionExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(exemptionRecordedController.submitExemptionRecorded),
  ])

  return router
}
