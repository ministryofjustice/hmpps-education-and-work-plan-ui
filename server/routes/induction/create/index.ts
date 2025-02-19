import { RequestHandler, Router } from 'express'
import createError from 'http-errors'
import { Services } from '../../../services'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import HopingToWorkOnReleaseCreateController from './hopingToWorkOnReleaseCreateController'
import WantToAddQualificationsCreateController from './wantToAddQualificationsCreateController'
import createEmptyInductionIfNotInSession from '../../routerRequestHandlers/createEmptyInductionIfNotInSession'
import QualificationsListCreateController from './qualificationsListCreateController'
import retrieveCuriousFunctionalSkills from '../../routerRequestHandlers/retrieveCuriousFunctionalSkills'
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
import InPrisonWorkCreateController from './inPrisonWorkCreateController'
import InPrisonTrainingCreateController from './inPrisonTrainingCreateController'
import retrieveCuriousInPrisonCourses from '../../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import WhoCompletedInductionCreateController from './whoCompletedInductionCreateController'
import InductionNoteCreateController from './inductionNoteCreateController'
import config from '../../../config'
import checkInductionDoesNotExist from '../../routerRequestHandlers/checkInductionDoesNotExist'
import ApplicationAction from '../../../enums/applicationAction'

/**
 * Route definitions for creating an Induction
 *
 * All routes adopt the pattern:
 * /prisoners/<prison-number>/create-induction/<page-or-section-id>
 */
export default (router: Router, services: Services) => {
  const { curiousService, educationAndWorkPlanService, inductionService } = services

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
  const checkYourAnswersCreateController = new CheckYourAnswersCreateController(inductionService)
  const inPrisonWorkCreateController = new InPrisonWorkCreateController()
  const inPrisonTrainingCreateController = new InPrisonTrainingCreateController()
  const whoCompletedInductionController = new WhoCompletedInductionCreateController()
  const inductionNoteController = new InductionNoteCreateController()

  router.get('/prisoners/:prisonNumber/create-induction/**', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_INDUCTION),
    createEmptyInductionIfNotInSession(educationAndWorkPlanService),
    setCurrentPageInPageFlowQueue,
  ])
  router.post('/prisoners/:prisonNumber/create-induction/**', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_INDUCTION),
    createEmptyInductionIfNotInSession(educationAndWorkPlanService),
    setCurrentPageInPageFlowQueue,
  ])

  router.get('/prisoners/:prisonNumber/create-induction/hoping-to-work-on-release', [
    checkInductionDoesNotExist(inductionService),
    asyncMiddleware(hopingToWorkOnReleaseCreateController.getHopingToWorkOnReleaseView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/hoping-to-work-on-release', [
    asyncMiddleware(hopingToWorkOnReleaseCreateController.submitHopingToWorkOnReleaseForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/want-to-add-qualifications', [
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    asyncMiddleware(wantToAddQualificationsCreateController.getWantToAddQualificationsView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/want-to-add-qualifications', [
    asyncMiddleware(wantToAddQualificationsCreateController.submitWantToAddQualificationsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/qualifications', [
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
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

  router.get('/prisoners/:prisonNumber/create-induction/in-prison-work', [
    asyncMiddleware(inPrisonWorkCreateController.getInPrisonWorkView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/in-prison-work', [
    asyncMiddleware(inPrisonWorkCreateController.submitInPrisonWorkForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/in-prison-training', [
    asyncMiddleware(inPrisonTrainingCreateController.getInPrisonTrainingView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/in-prison-training', [
    asyncMiddleware(inPrisonTrainingCreateController.submitInPrisonTrainingForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/who-completed-induction', [
    checkInductionReviewsFeatureIsEnabled(),
    asyncMiddleware(whoCompletedInductionController.getWhoCompletedInductionView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/who-completed-induction', [
    checkInductionReviewsFeatureIsEnabled(),
    asyncMiddleware(whoCompletedInductionController.submitWhoCompletedInductionForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/notes', [
    checkInductionReviewsFeatureIsEnabled(),
    asyncMiddleware(inductionNoteController.getInductionNoteView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/notes', [
    checkInductionReviewsFeatureIsEnabled(),
    asyncMiddleware(inductionNoteController.submitInductionNoteForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/check-your-answers', [
    asyncMiddleware(checkYourAnswersCreateController.getCheckYourAnswersView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/check-your-answers', [
    asyncMiddleware(checkYourAnswersCreateController.submitCheckYourAnswers),
  ])
}

const checkInductionReviewsFeatureIsEnabled = (): RequestHandler => {
  return asyncMiddleware((req, res, next) => {
    if (config.featureToggles.reviewsEnabled) {
      return next()
    }
    return next(createError(404, `Route ${req.originalUrl} not enabled`))
  })
}
