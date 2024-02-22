import { Router } from 'express'
import { Services } from '../../../services'
import config from '../../../config'
import { checkUserHasEditAuthority } from '../../../middleware/roleBasedAccessControl'
import { retrieveInductionIfNotInSession, retrievePrisonerSummaryIfNotInSession } from '../../routerRequestHandlers'
import InPrisonWorkUpdateController from './inPrisonWorkUpdateController'

/**
 * Route definitions for updating the various sections of an Induction
 *
 * All routes adopt the pattern:
 * /prisoners/<prison-number>/induction/<page/section-id>
 */
export default (router: Router, services: Services) => {
  const inPrisonTrainingAndEducationUpdateController = new InPrisonWorkUpdateController()

  if (isAnyUpdateSectionEnabled()) {
    router.get('/prisoners/:prisonNumber/induction/**', [
      checkUserHasEditAuthority(),
      retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
      retrieveInductionIfNotInSession(services.inductionService),
    ])
    router.post('/prisoners/:prisonNumber/induction/**', [
      checkUserHasEditAuthority(),
      retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
      retrieveInductionIfNotInSession(services.inductionService),
    ])
  }

  if (config.featureToggles.induction.update.trainingAndInterestsInPrisonSectionEnabled) {
    router.get('/prisoners/:prisonNumber/induction/in-prison-work', [
      inPrisonTrainingAndEducationUpdateController.getInPrisonWorkView,
    ])
    router.post('/prisoners/:prisonNumber/induction/in-prison-work', [
      inPrisonTrainingAndEducationUpdateController.submitInPrisonWorkForm,
    ])
  }
}

const isAnyUpdateSectionEnabled = (): boolean =>
  config.featureToggles.induction.update.skillsAndInterestsSectionEnabled ||
  config.featureToggles.induction.update.workExperienceSectionEnabled ||
  config.featureToggles.induction.update.workInterestsSectionEnabled ||
  config.featureToggles.induction.update.trainingAndInterestsInPrisonSectionEnabled
