import { Router } from 'express'
import { Services } from '../../../services'
import config from '../../../config'
import { checkUserHasEditAuthority } from '../../../middleware/roleBasedAccessControl'
import { retrieveInductionIfNotInSession, retrievePrisonerSummaryIfNotInSession } from '../../routerRequestHandlers'
import InPrisonWorkUpdateController from './inPrisonWorkUpdateController'
import SkillsUpdateController from './skillsUpdateController'
import PersonalInterestsUpdateController from './personalInterestsUpdateController'

/**
 * Route definitions for updating the various sections of an Induction
 *
 * All routes adopt the pattern:
 * /prisoners/<prison-number>/induction/<page/section-id>
 */
export default (router: Router, services: Services) => {
  const inPrisonTrainingAndEducationUpdateController = new InPrisonWorkUpdateController(services.inductionService)
  const skillsUpdateController = new SkillsUpdateController(services.inductionService)
  const personalInterestsUpdateController = new PersonalInterestsUpdateController(services.inductionService)

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

  if (config.featureToggles.induction.update.skillsAndInterestsSectionEnabled) {
    router.get('/prisoners/:prisonNumber/induction/personal-interests', [
      personalInterestsUpdateController.getPersonalInterestsView,
    ])
    router.post('/prisoners/:prisonNumber/induction/personal-interests', [
      personalInterestsUpdateController.submitPersonalInterestsForm,
    ])

    router.get('/prisoners/:prisonNumber/induction/skills', [skillsUpdateController.getSkillsView])
    router.post('/prisoners/:prisonNumber/induction/skills', [skillsUpdateController.submitSkillsForm])
  }
}

const isAnyUpdateSectionEnabled = (): boolean =>
  config.featureToggles.induction.update.skillsAndInterestsSectionEnabled ||
  config.featureToggles.induction.update.workExperienceSectionEnabled ||
  config.featureToggles.induction.update.workInterestsSectionEnabled ||
  config.featureToggles.induction.update.trainingAndInterestsInPrisonSectionEnabled
