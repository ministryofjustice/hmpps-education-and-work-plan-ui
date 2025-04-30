import { Router } from 'express'
import { Services } from '../../../../services'
import asyncMiddleware from '../../../../middleware/asyncMiddleware'
import createEmptyInductionExemptionDtoIfNotInJourneyData from '../../../routerRequestHandlers/createEmptyInductionExemptionDtoIfNotInJourneyData'
import ExemptionReasonController from './exemptionReasonController'
import ConfirmExemptionController from './confirmExemptionController'
import checkInductionExemptionDtoExistsInJourneyData from '../../../routerRequestHandlers/checkInductionExemptionDtoExistsInJourneyData'
import retrieveInductionSchedule from '../../../routerRequestHandlers/retrieveInductionSchedule'
import ExemptionRecordedController from './exemptionRecordedController'
import checkInductionIsScheduled from '../../../routerRequestHandlers/checkInductionIsScheduled'
import { checkUserHasPermissionTo } from '../../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../../enums/applicationAction'
import setupJourneyData from '../../../routerRequestHandlers/setupJourneyData'

/**
 * Route definitions for exempting a prisoner's Induction
 */
export default (services: Services) => {
  const { auditService, inductionService, journeyDataService } = services

  const exemptionReasonController = new ExemptionReasonController()
  const confirmExemptionController = new ConfirmExemptionController(inductionService, auditService)
  const exemptionRecordedController = new ExemptionRecordedController()

  const router = Router({ mergeParams: true })

  router.use([
    // comment to allow formatting code with line breaks
    checkUserHasPermissionTo(ApplicationAction.EXEMPT_INDUCTION),
    setupJourneyData(journeyDataService),
  ])

  router.get('/', [
    checkInductionIsScheduled(inductionService), // Induction Schedule must be SCHEDULED in order to exempt it
    createEmptyInductionExemptionDtoIfNotInJourneyData,
    asyncMiddleware(exemptionReasonController.getExemptionReasonView),
  ])
  router.post('/', [
    checkInductionExemptionDtoExistsInJourneyData,
    asyncMiddleware(exemptionReasonController.submitExemptionReasonForm),
  ])

  router.get('/confirm', [
    checkInductionExemptionDtoExistsInJourneyData,
    asyncMiddleware(confirmExemptionController.getConfirmExemptionView),
  ])
  router.post('/confirm', [
    checkInductionExemptionDtoExistsInJourneyData,
    asyncMiddleware(confirmExemptionController.submitConfirmExemption),
  ])

  router.get('/recorded', [
    checkInductionExemptionDtoExistsInJourneyData,
    retrieveInductionSchedule(inductionService),
    asyncMiddleware(exemptionRecordedController.getExemptionRecordedView),
  ])
  router.post('/recorded', [
    checkInductionExemptionDtoExistsInJourneyData,
    asyncMiddleware(exemptionRecordedController.submitExemptionRecorded),
  ])

  return router
}
