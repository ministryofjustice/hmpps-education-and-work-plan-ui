import { Router } from 'express'
import { Services } from '../../../services'
import config from '../../../config'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { checkUserHasEditAuthority } from '../../../middleware/roleBasedAccessControl'
import HopingToWorkOnReleaseCreateController from './hopingToWorkOnReleaseCreateController'
import WantToAddQualificationsCreateController from './wantToAddQualificationsCreateController'
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
  const wantToAddQualificationsCreateController = new WantToAddQualificationsCreateController()
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
      createEmptyInductionIfNotInSession,
      setCurrentPageInPageFlowQueue,
    ])
    router.post('/prisoners/:prisonNumber/create-induction/**', [
      checkUserHasEditAuthority(),
      createEmptyInductionIfNotInSession,
      setCurrentPageInPageFlowQueue,
    ])

    router.get('/prisoners/:prisonNumber/create-induction/hoping-to-work-on-release', [
      asyncMiddleware(hopingToWorkOnReleaseCreateController.getHopingToWorkOnReleaseView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/hoping-to-work-on-release', [
      asyncMiddleware(hopingToWorkOnReleaseCreateController.submitHopingToWorkOnReleaseForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/want-to-add-qualifications', [
      retrieveFunctionalSkillsIfNotInSession(services.curiousService),
      asyncMiddleware(wantToAddQualificationsCreateController.getWantToAddQualificationsView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/want-to-add-qualifications', [
      asyncMiddleware(wantToAddQualificationsCreateController.submitWantToAddQualificationsForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/qualifications', [
      retrieveFunctionalSkillsIfNotInSession(services.curiousService),
      asyncMiddleware(qualificationsListCreateController.getQualificationsListView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/qualifications', [
      asyncMiddleware(qualificationsListCreateController.submitQualificationsListView),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/highest-level-of-education', [
      asyncMiddleware(highestLevelOfEducationCreateController.getHighestLevelOfEducationView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/highest-level-of-education', [
      asyncMiddleware(highestLevelOfEducationCreateController.submitHighestLevelOfEducationForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/qualification-level', [
      asyncMiddleware(qualificationLevelCreateController.getQualificationLevelView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/qualification-level', [
      asyncMiddleware(qualificationLevelCreateController.submitQualificationLevelForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/qualification-details', [
      asyncMiddleware(qualificationDetailsCreateController.getQualificationDetailsView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/qualification-details', [
      asyncMiddleware(qualificationDetailsCreateController.submitQualificationDetailsForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/additional-training', [
      asyncMiddleware(additionalTrainingCreateController.getAdditionalTrainingView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/additional-training', [
      asyncMiddleware(additionalTrainingCreateController.submitAdditionalTrainingForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/has-worked-before', [
      asyncMiddleware(workedBeforeCreateController.getWorkedBeforeView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/has-worked-before', [
      asyncMiddleware(workedBeforeCreateController.submitWorkedBeforeForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/previous-work-experience', [
      asyncMiddleware(previousWorkExperienceTypesCreateController.getPreviousWorkExperienceTypesView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/previous-work-experience', [
      asyncMiddleware(previousWorkExperienceTypesCreateController.submitPreviousWorkExperienceTypesForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/previous-work-experience/:typeOfWorkExperience', [
      asyncMiddleware(previousWorkExperienceDetailCreateController.getPreviousWorkExperienceDetailView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/previous-work-experience/:typeOfWorkExperience', [
      asyncMiddleware(previousWorkExperienceDetailCreateController.submitPreviousWorkExperienceDetailForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/work-interest-types', [
      asyncMiddleware(workInterestTypesCreateController.getWorkInterestTypesView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/work-interest-types', [
      asyncMiddleware(workInterestTypesCreateController.submitWorkInterestTypesForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/work-interest-roles', [
      asyncMiddleware(workInterestRolesCreateController.getWorkInterestRolesView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/work-interest-roles', [
      asyncMiddleware(workInterestRolesCreateController.submitWorkInterestRolesForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/skills', [
      asyncMiddleware(skillsCreateController.getSkillsView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/skills', [
      asyncMiddleware(skillsCreateController.submitSkillsForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/personal-interests', [
      asyncMiddleware(personalInterestsCreateController.getPersonalInterestsView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/personal-interests', [
      asyncMiddleware(personalInterestsCreateController.submitPersonalInterestsForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/affect-ability-to-work', [
      asyncMiddleware(affectAbilityToWorkCreateController.getAffectAbilityToWorkView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/affect-ability-to-work', [
      asyncMiddleware(affectAbilityToWorkCreateController.submitAffectAbilityToWorkForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/skills', [
      asyncMiddleware(skillsCreateController.getSkillsView),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/reasons-not-to-get-work', [
      asyncMiddleware(reasonsNotToGetWorkCreateController.getReasonsNotToGetWorkView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/reasons-not-to-get-work', [
      asyncMiddleware(reasonsNotToGetWorkCreateController.submitReasonsNotToGetWorkForm),
    ])

    router.get('/prisoners/:prisonNumber/create-induction/check-your-answers', [
      asyncMiddleware(checkYourAnswersCreateController.getCheckYourAnswersView),
    ])
    router.post('/prisoners/:prisonNumber/create-induction/check-your-answers', [
      asyncMiddleware(checkYourAnswersCreateController.submitCheckYourAnswers),
    ])
  }
}
