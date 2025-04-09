import { Router } from 'express'
import { Services } from '../../../services'
import exemptInductionRoutes from './exemption'
import removeInductionExemptionRoutes from './removeExemption'

/**
 * Route definitions for exempting, and removing the exemption of a prisoner's Induction
 */
export default (router: Router, services: Services) => {
  exemptInductionRoutes(router, services)
  removeInductionExemptionRoutes(router, services)
}
