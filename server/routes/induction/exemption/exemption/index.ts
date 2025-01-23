import { Router } from 'express'
import { Services } from '../../../../services'
import asyncMiddleware from '../../../../middleware/asyncMiddleware'
import createEmptyInductionExemptionDtoIfNotInPrisonerContext from '../../../routerRequestHandlers/createEmptyInductionExemptionDtoIfNotInPrisonerContext'
import ExemptionReasonController from './exemptionReasonController'

/**
 * Route definitions for exempting a prisoner's Induction
 */
export default (router: Router, _services: Services) => {
  const exemptionReasonController = new ExemptionReasonController()

  router.get('/prisoners/:prisonNumber/induction/exemption', [
    createEmptyInductionExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.getExemptionReasonView),
  ])
  router.post('/prisoners/:prisonNumber/induction/exemption', [
    createEmptyInductionExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.submitExemptionReasonForm),
  ])
}
