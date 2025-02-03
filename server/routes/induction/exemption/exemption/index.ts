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

/**
 * Route definitions for exempting a prisoner's Induction
 */
export default (router: Router, services: Services) => {
  const { auditService, inductionService } = services

  const exemptionReasonController = new ExemptionReasonController()
  const confirmExemptionController = new ConfirmExemptionController(inductionService, auditService)
  const exemptionRecordedController = new ExemptionRecordedController()

  router.get('/prisoners/:prisonNumber/induction/exemption', [
    checkInductionIsScheduled(inductionService), // Induction Schedule must be SCHEDULED in order to exempt it
    createEmptyInductionExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.getExemptionReasonView),
  ])
  router.post('/prisoners/:prisonNumber/induction/exemption', [
    createEmptyInductionExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.submitExemptionReasonForm),
  ])

  router.get('/prisoners/:prisonNumber/induction/exemption/confirm', [
    checkInductionExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(confirmExemptionController.getConfirmExemptionView),
  ])
  router.post('/prisoners/:prisonNumber/induction/exemption/confirm', [
    checkInductionExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(confirmExemptionController.submitConfirmExemption),
  ])

  router.get('/prisoners/:prisonNumber/induction/exemption/recorded', [
    checkInductionExemptionDtoExistsInPrisonerContext,
    retrieveInductionSchedule(inductionService),
    asyncMiddleware(exemptionRecordedController.getExemptionRecordedView),
  ])
  router.post('/prisoners/:prisonNumber/induction/exemption/recorded', [
    checkInductionExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(exemptionRecordedController.submitExemptionRecorded),
  ])
}
