import { Router } from 'express'
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
import checkInductionDoesNotExist from '../../routerRequestHandlers/checkInductionDoesNotExist'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../routerRequestHandlers/insertJourneyIdentifier'

/**
 * Route definitions for creating an Induction
 *
 * All routes adopt the pattern:
 * /prisoners/<prison-number>/create-induction/<journeyId>/<page-or-section-id>
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

  router.use('/prisoners/:prisonNumber/create-induction', [
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/prisoners/:prisonNumber/create-induction' - eg: '/prisoners/A1234BC/create-induction/473e9ee4-37d6-4afb-92a2-5729b10cc60f/hoping-to-work-on-release'
    checkUserHasPermissionTo(ApplicationAction.RECORD_INDUCTION),
    createEmptyInductionIfNotInSession(educationAndWorkPlanService),
    setCurrentPageInPageFlowQueue,
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/hoping-to-work-on-release', [
    checkInductionDoesNotExist(inductionService),
    asyncMiddleware(hopingToWorkOnReleaseCreateController.getHopingToWorkOnReleaseView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/hoping-to-work-on-release', [
    asyncMiddleware(hopingToWorkOnReleaseCreateController.submitHopingToWorkOnReleaseForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/want-to-add-qualifications', [
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    asyncMiddleware(wantToAddQualificationsCreateController.getWantToAddQualificationsView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/want-to-add-qualifications', [
    asyncMiddleware(wantToAddQualificationsCreateController.submitWantToAddQualificationsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/qualifications', [
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    asyncMiddleware(qualificationsListCreateController.getQualificationsListView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/qualifications', [
    asyncMiddleware(qualificationsListCreateController.submitQualificationsListView),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationCreateController.getHighestLevelOfEducationView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationCreateController.submitHighestLevelOfEducationForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/qualification-level', [
    asyncMiddleware(qualificationLevelCreateController.getQualificationLevelView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/qualification-level', [
    asyncMiddleware(qualificationLevelCreateController.submitQualificationLevelForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/qualification-details', [
    asyncMiddleware(qualificationDetailsCreateController.getQualificationDetailsView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/qualification-details', [
    asyncMiddleware(qualificationDetailsCreateController.submitQualificationDetailsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/additional-training', [
    asyncMiddleware(additionalTrainingCreateController.getAdditionalTrainingView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/additional-training', [
    asyncMiddleware(additionalTrainingCreateController.submitAdditionalTrainingForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/has-worked-before', [
    asyncMiddleware(workedBeforeCreateController.getWorkedBeforeView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/has-worked-before', [
    asyncMiddleware(workedBeforeCreateController.submitWorkedBeforeForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/previous-work-experience', [
    asyncMiddleware(previousWorkExperienceTypesCreateController.getPreviousWorkExperienceTypesView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/previous-work-experience', [
    asyncMiddleware(previousWorkExperienceTypesCreateController.submitPreviousWorkExperienceTypesForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/previous-work-experience/:typeOfWorkExperience', [
    asyncMiddleware(previousWorkExperienceDetailCreateController.getPreviousWorkExperienceDetailView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/previous-work-experience/:typeOfWorkExperience', [
    asyncMiddleware(previousWorkExperienceDetailCreateController.submitPreviousWorkExperienceDetailForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/work-interest-types', [
    asyncMiddleware(workInterestTypesCreateController.getWorkInterestTypesView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/work-interest-types', [
    asyncMiddleware(workInterestTypesCreateController.submitWorkInterestTypesForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/work-interest-roles', [
    asyncMiddleware(workInterestRolesCreateController.getWorkInterestRolesView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/work-interest-roles', [
    asyncMiddleware(workInterestRolesCreateController.submitWorkInterestRolesForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/skills', [
    asyncMiddleware(skillsCreateController.getSkillsView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/skills', [
    asyncMiddleware(skillsCreateController.submitSkillsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/personal-interests', [
    asyncMiddleware(personalInterestsCreateController.getPersonalInterestsView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/personal-interests', [
    asyncMiddleware(personalInterestsCreateController.submitPersonalInterestsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/affect-ability-to-work', [
    asyncMiddleware(affectAbilityToWorkCreateController.getAffectAbilityToWorkView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/affect-ability-to-work', [
    asyncMiddleware(affectAbilityToWorkCreateController.submitAffectAbilityToWorkForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/in-prison-work', [
    asyncMiddleware(inPrisonWorkCreateController.getInPrisonWorkView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/in-prison-work', [
    asyncMiddleware(inPrisonWorkCreateController.submitInPrisonWorkForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/in-prison-training', [
    asyncMiddleware(inPrisonTrainingCreateController.getInPrisonTrainingView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/in-prison-training', [
    asyncMiddleware(inPrisonTrainingCreateController.submitInPrisonTrainingForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/who-completed-induction', [
    asyncMiddleware(whoCompletedInductionController.getWhoCompletedInductionView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/who-completed-induction', [
    asyncMiddleware(whoCompletedInductionController.submitWhoCompletedInductionForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/notes', [
    asyncMiddleware(inductionNoteController.getInductionNoteView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/notes', [
    asyncMiddleware(inductionNoteController.submitInductionNoteForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/check-your-answers', [
    asyncMiddleware(checkYourAnswersCreateController.getCheckYourAnswersView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/check-your-answers', [
    asyncMiddleware(checkYourAnswersCreateController.submitCheckYourAnswers),
  ])
}
