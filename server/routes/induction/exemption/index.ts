import { Router } from 'express'
import { Services } from '../../../services'
import exemptInductionRoutes from './exemption'
import removeInductionExemptionRoutes from './removeExemption'
import insertJourneyIdentifier from '../../routerRequestHandlers/insertJourneyIdentifier'

/**
 * Route definitions for exempting, and removing the exemption of a prisoner's Induction
 */
export default (router: Router, services: Services) => {
  router.use(
    '/prisoners/:prisonNumber/induction/exemption',
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/prisoners/:prisonNumber/induction' - eg: '/prisoners/A1234BC/induction/473e9ee4-37d6-4afb-92a2-5729b10cc60f/exemption'
  )
  router.use('/prisoners/:prisonNumber/induction/:journeyId/exemption', exemptInductionRoutes(services))
  router.use('/prisoners/:prisonNumber/induction/:journeyId/exemption', removeInductionExemptionRoutes(services))
}
