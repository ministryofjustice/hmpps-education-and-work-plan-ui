import { Router } from 'express'
import { Services } from '../../../services'
import config from '../../../config'
import { checkUserHasEditAuthority } from '../../../middleware/roleBasedAccessControl'
import {
  retrieveFunctionalSkillsIfNotInSession,
  retrieveInductionIfNotInSession,
  retrievePrisonerSummaryIfNotInSession,
  setCurrentPageInPageFlowQueue,
} from '../../routerRequestHandlers'
import InPrisonWorkUpdateController from './inPrisonWorkUpdateController'
import InPrisonTrainingUpdateController from './inPrisonTrainingUpdateController'
import SkillsUpdateController from './skillsUpdateController'
import PersonalInterestsUpdateController from './personalInterestsUpdateController'
import WorkedBeforeUpdateController from './workedBeforeUpdateController'
import PreviousWorkExperienceDetailUpdateController from './previousWorkExperienceDetailUpdateController'
import PreviousWorkExperienceTypesUpdateController from './previousWorkExperienceTypesUpdateController'
import AffectAbilityToWorkUpdateController from './affectAbilityToWorkUpdateController'
import ReasonsNotToGetWorkUpdateController from './reasonsNotToGetWorkUpdateController'
import WorkInterestTypesUpdateController from './workInterestTypesUpdateController'
import WorkInterestRolesUpdateController from './workInterestRolesUpdateController'
import HighestLevelOfEducationUpdateController from './highestLevelOfEducationUpdateController'
import AdditionalTrainingUpdateController from './additionalTrainingUpdateController'
import QualificationsListUpdateController from './qualificationsListUpdateController'
import QualificationLevelUpdateController from './qualificationLevelUpdateController'
import QualificationDetailsUpdateController from './qualificationDetailsUpdateController'
import HopingToWorkOnReleaseUpdateController from './hopingToWorkOnReleaseUpdateController'

/**
 * Route definitions for updating the various sections of an Induction
 *
 * All routes adopt the pattern:
 * /prisoners/<prison-number>/induction/<page/section-id>
 */
export default (router: Router, services: Services) => {
  const { inductionService } = services
  const hopingToWorkOnReleaseController = new HopingToWorkOnReleaseUpdateController()
  const inPrisonWorkUpdateController = new InPrisonWorkUpdateController(inductionService)
  const inPrisonTrainingUpdateController = new InPrisonTrainingUpdateController(inductionService)
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
  const highestLevelOfEducationUpdateController = new HighestLevelOfEducationUpdateController(inductionService)
  const qualificationLevelUpdateController = new QualificationLevelUpdateController()
  const qualificationDetailsUpdateController = new QualificationDetailsUpdateController()
  const additionalTrainingUpdateController = new AdditionalTrainingUpdateController(inductionService)
  const qualificationsListUpdateController = new QualificationsListUpdateController(inductionService)

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

  if (config.featureToggles.induction.update.inPrisonTrainingSectionEnabled) {
    router.get('/prisoners/:prisonNumber/induction/in-prison-training', [
      inPrisonTrainingUpdateController.getInPrisonTrainingView,
    ])
    router.post('/prisoners/:prisonNumber/induction/in-prison-training', [
      inPrisonTrainingUpdateController.submitInPrisonTrainingForm,
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
    router.get('/prisoners/:prisonNumber/induction/hoping-to-work-on-release', [
      hopingToWorkOnReleaseController.getHopingToWorkOnReleaseView,
    ])

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

    router.get('/prisoners/:prisonNumber/induction/in-prison-work', [inPrisonWorkUpdateController.getInPrisonWorkView])
    router.post('/prisoners/:prisonNumber/induction/in-prison-work', [
      inPrisonWorkUpdateController.submitInPrisonWorkForm,
    ])
  }

  if (config.featureToggles.induction.update.prePrisonEducationSectionEnabled) {
    router.get('/prisoners/:prisonNumber/induction/qualifications', [
      retrieveFunctionalSkillsIfNotInSession(services.curiousService),
      qualificationsListUpdateController.getQualificationsListView,
    ])
    router.post('/prisoners/:prisonNumber/induction/qualifications', [
      qualificationsListUpdateController.submitQualificationsListView,
    ])

    router.get('/prisoners/:prisonNumber/induction/highest-level-of-education', [
      highestLevelOfEducationUpdateController.getHighestLevelOfEducationView,
    ])
    router.post('/prisoners/:prisonNumber/induction/highest-level-of-education', [
      highestLevelOfEducationUpdateController.submitHighestLevelOfEducationForm,
    ])

    router.get('/prisoners/:prisonNumber/induction/qualification-level', [
      qualificationLevelUpdateController.getQualificationLevelView,
    ])
    router.post('/prisoners/:prisonNumber/induction/qualification-level', [
      qualificationLevelUpdateController.submitQualificationLevelForm,
    ])

    router.get('/prisoners/:prisonNumber/induction/qualification-details', [
      qualificationDetailsUpdateController.getQualificationDetailsView,
    ])
    router.post('/prisoners/:prisonNumber/induction/qualification-details', [
      qualificationDetailsUpdateController.submitQualificationDetailsForm,
    ])

    router.get('/prisoners/:prisonNumber/induction/additional-training', [
      additionalTrainingUpdateController.getAdditionalTrainingView,
    ])
    router.post('/prisoners/:prisonNumber/induction/additional-training', [
      additionalTrainingUpdateController.submitAdditionalTrainingForm,
    ])
  }
}

const isAnyUpdateSectionEnabled = (): boolean =>
  config.featureToggles.induction.update.skillsAndInterestsSectionEnabled ||
  config.featureToggles.induction.update.workExperienceSectionEnabled ||
  config.featureToggles.induction.update.workInterestsSectionEnabled ||
  config.featureToggles.induction.update.inPrisonTrainingSectionEnabled ||
  config.featureToggles.induction.update.prePrisonEducationSectionEnabled
