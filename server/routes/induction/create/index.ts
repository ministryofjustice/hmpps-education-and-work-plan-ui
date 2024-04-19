import { Router } from 'express'
import { Services } from '../../../services'
import config from '../../../config'
import { checkUserHasEditAuthority } from '../../../middleware/roleBasedAccessControl'
import retrievePrisonerSummaryIfNotInSession from '../../routerRequestHandlers/retrievePrisonerSummaryIfNotInSession'
import HopingToWorkOnReleaseCreateController from './hopingToWorkOnReleaseCreateController'
import createEmptyInductionIfNotInSession from '../../routerRequestHandlers/createEmptyInductionIfNotInSession'
import QualificationsListCreateController from './qualificationsListCreateController'
import retrieveFunctionalSkillsIfNotInSession from '../../routerRequestHandlers/retrieveFunctionalSkillsIfNotInSession'

/**
 * Route definitions for creating an Induction
 *
 * All routes adopt the pattern:
 * /prisoners/<prison-number>/create-induction/<page-or-section-id>
 */
export default (router: Router, services: Services) => {
  const hopingToWorkOnReleaseCreateController = new HopingToWorkOnReleaseCreateController()
  const qualificationsListCreateController = new QualificationsListCreateController()

  if (config.featureToggles.induction.create.enabled) {
    router.get('/prisoners/:prisonNumber/create-induction/**', [
      checkUserHasEditAuthority(),
      retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
      createEmptyInductionIfNotInSession,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/**', [
      checkUserHasEditAuthority(),
      retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
      createEmptyInductionIfNotInSession,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/hoping-to-work-on-release', [
      hopingToWorkOnReleaseCreateController.getHopingToWorkOnReleaseView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/hoping-to-work-on-release', [
      hopingToWorkOnReleaseCreateController.submitHopingToWorkOnReleaseForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/qualifications', [
      retrieveFunctionalSkillsIfNotInSession(services.curiousService),
      qualificationsListCreateController.getQualificationsListView,
    ])
  }
}
