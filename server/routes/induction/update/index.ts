import { Router } from 'express'
import { Services } from '../../../services'
import config from '../../../config'
import { checkUserHasEditAuthority } from '../../../middleware/roleBasedAccessControl'
import {
  retrieveInductionIfNotInSession,
  retrievePrisonerSummaryIfNotInSession,
  setCurrentPageInPageFlowQueue,
} from '../../routerRequestHandlers'
import InPrisonWorkUpdateController from './inPrisonWorkUpdateController'
import SkillsUpdateController from './skillsUpdateController'
import PersonalInterestsUpdateController from './personalInterestsUpdateController'
import WorkedBeforeUpdateController from './workedBeforeUpdateController'
import PreviousWorkExperienceDetailUpdateController from './previousWorkExperienceDetailUpdateController'
import PreviousWorkExperienceTypesUpdateController from './previousWorkExperienceTypesUpdateController'
import AffectAbilityToWorkUpdateController from './affectAbilityToWorkUpdateController'
import ReasonsNotToGetWorkUpdateController from './reasonsNotToGetWorkUpdateController'
import WorkInterestTypesUpdateController from './workInterestTypesUpdateController'
import WorkInterestRolesUpdateController from './workInterestRolesUpdateController'

/**
 * Route definitions for updating the various sections of an Induction
 *
 * All routes adopt the pattern:
 * /prisoners/<prison-number>/induction/<page/section-id>
 */
export default (router: Router, services: Services) => {
  const { inductionService } = services
  const inPrisonTrainingAndEducationUpdateController = new InPrisonWorkUpdateController(inductionService)
  const skillsUpdateController = new SkillsUpdateController(inductionService)
  const personalInterestsUpdateController = new PersonalInterestsUpdateController(inductionService)
  const workedBeforeUpdateController = new WorkedBeforeUpdateController(inductionService)
  const previousWorkExperienceTypesUpdateController = new PreviousWorkExperienceTypesUpdateController(inductionService)
  const previousWorkExperienceDetailUpdateController = new PreviousWorkExperienceDetailUpdateController(
    inductionService,
  )
  const affectAbilityToWorkUpdateController = new AffectAbilityToWorkUpdateController(inductionService)
  const reasonsNotToGetWorkUpdateController = new ReasonsNotToGetWorkUpdateController(inductionService)
  const workInterestTypesUpdateController = new WorkInterestTypesUpdateController(inductionService)
  const workInterestRolesUpdateController = new WorkInterestRolesUpdateController(inductionService)

  if (isAnyUpdateSectionEnabled()) {
    router.get('/prisoners/:prisonNumber/induction/**', [
      checkUserHasEditAuthority(),
      retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
      retrieveInductionIfNotInSession(services.inductionService),
      setCurrentPageInPageFlowQueue,
    ])
    router.post('/prisoners/:prisonNumber/induction/**', [
      checkUserHasEditAuthority(),
      retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
      retrieveInductionIfNotInSession(services.inductionService),
      setCurrentPageInPageFlowQueue,
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

  if (config.featureToggles.induction.update.workExperienceSectionEnabled) {
    router.get('/prisoners/:prisonNumber/induction/has-worked-before', [
      workedBeforeUpdateController.getWorkedBeforeView,
    ])
    router.post('/prisoners/:prisonNumber/induction/has-worked-before', [
      workedBeforeUpdateController.submitWorkedBeforeForm,
    ])

    router.get('/prisoners/:prisonNumber/induction/previous-work-experience', [
      previousWorkExperienceTypesUpdateController.getPreviousWorkExperienceTypesView,
    ])
    router.post('/prisoners/:prisonNumber/induction/previous-work-experience', [
      previousWorkExperienceTypesUpdateController.submitPreviousWorkExperienceTypesForm,
    ])

    router.get('/prisoners/:prisonNumber/induction/previous-work-experience/:typeOfWorkExperience', [
      previousWorkExperienceDetailUpdateController.getPreviousWorkExperienceDetailView,
    ])
    router.post('/prisoners/:prisonNumber/induction/previous-work-experience/:typeOfWorkExperience', [
      previousWorkExperienceDetailUpdateController.submitPreviousWorkExperienceDetailForm,
    ])
  }

  if (config.featureToggles.induction.update.workInterestsSectionEnabled) {
    router.get('/prisoners/:prisonNumber/induction/affect-ability-to-work', [
      affectAbilityToWorkUpdateController.getAffectAbilityToWorkView,
    ])
    router.post('/prisoners/:prisonNumber/induction/affect-ability-to-work', [
      affectAbilityToWorkUpdateController.submitAffectAbilityToWorkForm,
    ])

    router.get('/prisoners/:prisonNumber/induction/reasons-not-to-get-work', [
      reasonsNotToGetWorkUpdateController.getReasonsNotToGetWorkView,
    ])
    router.post('/prisoners/:prisonNumber/induction/reasons-not-to-get-work', [
      reasonsNotToGetWorkUpdateController.submitReasonsNotToGetWorkForm,
    ])

    router.get('/prisoners/:prisonNumber/induction/work-interest-types', [
      workInterestTypesUpdateController.getWorkInterestTypesView,
    ])
    router.post('/prisoners/:prisonNumber/induction/work-interest-types', [
      workInterestTypesUpdateController.submitWorkInterestTypesForm,
    ])

    router.get('/prisoners/:prisonNumber/induction/work-interest-roles', [
      workInterestRolesUpdateController.getWorkInterestRolesView,
    ])
    router.post('/prisoners/:prisonNumber/induction/work-interest-roles', [
      workInterestRolesUpdateController.submitWorkInterestRolesForm,
    ])
  }
}

const isAnyUpdateSectionEnabled = (): boolean =>
  config.featureToggles.induction.update.skillsAndInterestsSectionEnabled ||
  config.featureToggles.induction.update.workExperienceSectionEnabled ||
  config.featureToggles.induction.update.workInterestsSectionEnabled ||
  config.featureToggles.induction.update.trainingAndInterestsInPrisonSectionEnabled
