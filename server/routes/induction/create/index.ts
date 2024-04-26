import { Router } from 'express'
import { Services } from '../../../services'
import config from '../../../config'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { checkUserHasEditAuthority } from '../../../middleware/roleBasedAccessControl'
import retrievePrisonerSummaryIfNotInSession from '../../routerRequestHandlers/retrievePrisonerSummaryIfNotInSession'
import HopingToWorkOnReleaseCreateController from './hopingToWorkOnReleaseCreateController'
import createEmptyInductionIfNotInSession from '../../routerRequestHandlers/createEmptyInductionIfNotInSession'
import QualificationsListCreateController from './qualificationsListCreateController'
import retrieveFunctionalSkillsIfNotInSession from '../../routerRequestHandlers/retrieveFunctionalSkillsIfNotInSession'
import HighestLevelOfEducationCreateController from './highestLevelOfEducationCreateController'
import QualificationLevelCreateController from './qualificationLevelCreateController'
import setCurrentPageInPageFlowQueue from '../../routerRequestHandlers/setCurrentPageInPageFlowQueue'
import QualificationDetailsCreateController from './qualificationDetailsCreateController'
import AdditionalTrainingCreateController from './additionalTrainingCreateController'
import WorkedBeforeCreateController from './workedBeforeCreateController'
import PreviousWorkExperienceTypesCreateController from './previousWorkExperienceTypesCreateController'
import PreviousWorkExperienceDetailCreateController from './previousWorkExperienceDetailCreateController'
import WorkInterestTypesCreateController from './workInterestTypesCreateController'
import WorkInterestRolesCreateController from './workInterestRolesCreateController'
import SkillsCreateController from './skillsCreateController'
import PersonalInterestsCreateController from './personalInterestsCreateController'
import AffectAbilityToWorkCreateController from './affectAbilityToWorkCreateController'
import CheckYourAnswersCreateController from './checkYourAnswersCreateController'
import ReasonsNotToGetWorkCreateController from './reasonsNotToGetWorkCreateController'

/**
 * Route definitions for creating an Induction
 *
 * All routes adopt the pattern:
 * /prisoners/<prison-number>/create-induction/<page-or-section-id>
 */
export default (router: Router, services: Services) => {
  const hopingToWorkOnReleaseCreateController = new HopingToWorkOnReleaseCreateController()
  const qualificationsListCreateController = new QualificationsListCreateController()
  const highestLevelOfEducationCreateController = new HighestLevelOfEducationCreateController()
  const qualificationLevelCreateController = new QualificationLevelCreateController()
  const qualificationDetailsCreateController = new QualificationDetailsCreateController()
  const additionalTrainingCreateController = new AdditionalTrainingCreateController()
  const workedBeforeCreateController = new WorkedBeforeCreateController()
  const previousWorkExperienceTypesCreateController = new PreviousWorkExperienceTypesCreateController()
  const previousWorkExperienceDetailCreateController = new PreviousWorkExperienceDetailCreateController()
  const workInterestTypesCreateController = new WorkInterestTypesCreateController()
  const workInterestRolesCreateController = new WorkInterestRolesCreateController()
  const skillsCreateController = new SkillsCreateController()
  const personalInterestsCreateController = new PersonalInterestsCreateController()
  const affectAbilityToWorkCreateController = new AffectAbilityToWorkCreateController()
  const checkYourAnswersCreateController = new CheckYourAnswersCreateController(services.inductionService)
  const reasonsNotToGetWorkCreateController = new ReasonsNotToGetWorkCreateController()

  if (config.featureToggles.induction.create.enabled) {
    router.get('/prisoners/:prisonNumber/create-induction/**', [
      checkUserHasEditAuthority(),
      retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
      createEmptyInductionIfNotInSession,
      setCurrentPageInPageFlowQueue,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/**', [
      checkUserHasEditAuthority(),
      retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
      createEmptyInductionIfNotInSession,
      setCurrentPageInPageFlowQueue,
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
    router.post('/prisoners/:prisonNumber/create-induction/qualifications', [
      qualificationsListCreateController.submitQualificationsListView,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/highest-level-of-education', [
      highestLevelOfEducationCreateController.getHighestLevelOfEducationView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/highest-level-of-education', [
      highestLevelOfEducationCreateController.submitHighestLevelOfEducationForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/qualification-level', [
      qualificationLevelCreateController.getQualificationLevelView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/qualification-level', [
      qualificationLevelCreateController.submitQualificationLevelForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/qualification-details', [
      qualificationDetailsCreateController.getQualificationDetailsView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/qualification-details', [
      qualificationDetailsCreateController.submitQualificationDetailsForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/additional-training', [
      additionalTrainingCreateController.getAdditionalTrainingView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/additional-training', [
      additionalTrainingCreateController.submitAdditionalTrainingForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/has-worked-before', [
      workedBeforeCreateController.getWorkedBeforeView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/has-worked-before', [
      workedBeforeCreateController.submitWorkedBeforeForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/previous-work-experience', [
      previousWorkExperienceTypesCreateController.getPreviousWorkExperienceTypesView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/previous-work-experience', [
      previousWorkExperienceTypesCreateController.submitPreviousWorkExperienceTypesForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/previous-work-experience/:typeOfWorkExperience', [
      previousWorkExperienceDetailCreateController.getPreviousWorkExperienceDetailView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/previous-work-experience/:typeOfWorkExperience', [
      previousWorkExperienceDetailCreateController.submitPreviousWorkExperienceDetailForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/work-interest-types', [
      workInterestTypesCreateController.getWorkInterestTypesView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/work-interest-types', [
      workInterestTypesCreateController.submitWorkInterestTypesForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/work-interest-roles', [
      workInterestRolesCreateController.getWorkInterestRolesView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/work-interest-roles', [
      workInterestRolesCreateController.submitWorkInterestRolesForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/skills', [skillsCreateController.getSkillsView])
    router.post('/prisoners/:prisonNumber/create-induction/skills', [skillsCreateController.submitSkillsForm])

    router.get('/prisoners/:prisonNumber/create-induction/personal-interests', [
      personalInterestsCreateController.getPersonalInterestsView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/personal-interests', [
      personalInterestsCreateController.submitPersonalInterestsForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/affect-ability-to-work', [
      affectAbilityToWorkCreateController.getAffectAbilityToWorkView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/affect-ability-to-work', [
      affectAbilityToWorkCreateController.submitAffectAbilityToWorkForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/reasons-not-to-get-work', [
      asyncMiddleware(reasonsNotToGetWorkCreateController.getReasonsNotToGetWorkView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/reasons-not-to-get-work', [
      reasonsNotToGetWorkCreateController.submitReasonsNotToGetWorkForm,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/check-your-answers', [
      checkYourAnswersCreateController.getCheckYourAnswersView,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/check-your-answers', [
      checkYourAnswersCreateController.submitCheckYourAnswers,
    ])
  }
}
