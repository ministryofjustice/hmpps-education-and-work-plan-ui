import { Router } from 'express'
import { Services } from '../../../../services'
import asyncMiddleware from '../../../../middleware/asyncMiddleware'
import createEmptyInductionExemptionDtoIfNotInPrisonerContext from '../../../routerRequestHandlers/createEmptyInductionExemptionDtoIfNotInPrisonerContext'
import ExemptionReasonController from './exemptionReasonController'
import ConfirmExemptionController from './confirmExemptionController'
import checkInductionExemptionDtoExistsInPrisonerContext from '../../../routerRequestHandlers/checkInductionExemptionDtoExistsInPrisonerContext'

/**
 * Route definitions for exempting a prisoner's Induction
 */
export default (router: Router, services: Services) => {
  const { auditService, inductionService } = services

  const exemptionReasonController = new ExemptionReasonController()
  const confirmExemptionController = new ConfirmExemptionController(inductionService, auditService)

  router.get('/prisoners/:prisonNumber/induction/exemption', [
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
}
