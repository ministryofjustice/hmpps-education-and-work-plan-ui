import { Router } from 'express'
import { Services } from '../../../services'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import HopingToWorkOnReleaseCreateController from './hopingToWorkOnReleaseCreateController'
import WantToAddQualificationsCreateController from './wantToAddQualificationsCreateController'
import createEmptyInductionDtoIfNotInJourneyData from '../../routerRequestHandlers/createEmptyInductionDtoIfNotInJourneyData'
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
import setupJourneyData from '../../routerRequestHandlers/setupJourneyData'
import {
  additionalTrainingSchema,
  affectAbilityToWorkSchema,
  hopingToWorkOnReleaseSchema,
  inductionNoteSchema,
  inPrisonTrainingSchema,
  inPrisonWorkSchema,
  personalInterestsSchema,
  previousWorkExperienceDetailSchema,
  previousWorkExperienceTypesSchema,
  skillsSchema,
  wantToAddQualificationsSchema,
  whoCompletedInductionSchema,
  workedBeforeSchema,
  workInterestRolesSchema,
  workInterestTypesSchema,
} from '../validationSchemas'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import checkInductionDtoExistsInJourneyData from '../../routerRequestHandlers/checkInductionDtoExistsInJourneyData'
import retrievePrisonNamesById from '../../routerRequestHandlers/retrievePrisonNamesById'

/**
 * Route definitions for creating an Induction
 *
 * All routes adopt the pattern:
 * /prisoners/<prison-number>/create-induction/<journeyId>/<page-or-section-id>
 */
export default (router: Router, services: Services) => {
  const { curiousService, educationAndWorkPlanService, inductionService, journeyDataService, prisonService } = services

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
    checkUserHasPermissionTo(ApplicationAction.RECORD_INDUCTION),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/prisoners/:prisonNumber/create-induction' - eg: '/prisoners/A1234BC/create-induction/473e9ee4-37d6-4afb-92a2-5729b10cc60f/hoping-to-work-on-release'
  ])
  router.use('/prisoners/:prisonNumber/create-induction/:journeyId', [
    setupJourneyData(journeyDataService),
    setCurrentPageInPageFlowQueue,
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/hoping-to-work-on-release', [
    checkInductionDoesNotExist(inductionService),
    createEmptyInductionDtoIfNotInJourneyData(educationAndWorkPlanService),
    asyncMiddleware(hopingToWorkOnReleaseCreateController.getHopingToWorkOnReleaseView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/hoping-to-work-on-release', [
    checkInductionDtoExistsInJourneyData,
    validate(hopingToWorkOnReleaseSchema),
    asyncMiddleware(hopingToWorkOnReleaseCreateController.submitHopingToWorkOnReleaseForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/want-to-add-qualifications', [
    checkInductionDtoExistsInJourneyData,
    retrievePrisonNamesById(prisonService),
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    asyncMiddleware(wantToAddQualificationsCreateController.getWantToAddQualificationsView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/want-to-add-qualifications', [
    checkInductionDtoExistsInJourneyData,
    validate(wantToAddQualificationsSchema),
    asyncMiddleware(wantToAddQualificationsCreateController.submitWantToAddQualificationsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/qualifications', [
    checkInductionDtoExistsInJourneyData,
    retrievePrisonNamesById(prisonService),
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    asyncMiddleware(qualificationsListCreateController.getQualificationsListView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/qualifications', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(qualificationsListCreateController.submitQualificationsListView),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/highest-level-of-education', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(highestLevelOfEducationCreateController.getHighestLevelOfEducationView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/highest-level-of-education', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(highestLevelOfEducationCreateController.submitHighestLevelOfEducationForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/qualification-level', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(qualificationLevelCreateController.getQualificationLevelView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/qualification-level', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(qualificationLevelCreateController.submitQualificationLevelForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/qualification-details', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(qualificationDetailsCreateController.getQualificationDetailsView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/qualification-details', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(qualificationDetailsCreateController.submitQualificationDetailsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/additional-training', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(additionalTrainingCreateController.getAdditionalTrainingView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/additional-training', [
    checkInductionDtoExistsInJourneyData,
    validate(additionalTrainingSchema),
    asyncMiddleware(additionalTrainingCreateController.submitAdditionalTrainingForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/has-worked-before', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(workedBeforeCreateController.getWorkedBeforeView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/has-worked-before', [
    checkInductionDtoExistsInJourneyData,
    validate(workedBeforeSchema),
    asyncMiddleware(workedBeforeCreateController.submitWorkedBeforeForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/previous-work-experience', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(previousWorkExperienceTypesCreateController.getPreviousWorkExperienceTypesView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/previous-work-experience', [
    checkInductionDtoExistsInJourneyData,
    validate(previousWorkExperienceTypesSchema),
    asyncMiddleware(previousWorkExperienceTypesCreateController.submitPreviousWorkExperienceTypesForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/previous-work-experience/:typeOfWorkExperience', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(previousWorkExperienceDetailCreateController.getPreviousWorkExperienceDetailView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/previous-work-experience/:typeOfWorkExperience', [
    checkInductionDtoExistsInJourneyData,
    validate(previousWorkExperienceDetailSchema),
    asyncMiddleware(previousWorkExperienceDetailCreateController.submitPreviousWorkExperienceDetailForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/work-interest-types', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(workInterestTypesCreateController.getWorkInterestTypesView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/work-interest-types', [
    checkInductionDtoExistsInJourneyData,
    validate(workInterestTypesSchema),
    asyncMiddleware(workInterestTypesCreateController.submitWorkInterestTypesForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/work-interest-roles', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(workInterestRolesCreateController.getWorkInterestRolesView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/work-interest-roles', [
    checkInductionDtoExistsInJourneyData,
    validate(workInterestRolesSchema),
    asyncMiddleware(workInterestRolesCreateController.submitWorkInterestRolesForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/skills', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(skillsCreateController.getSkillsView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/skills', [
    checkInductionDtoExistsInJourneyData,
    validate(skillsSchema),
    asyncMiddleware(skillsCreateController.submitSkillsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/personal-interests', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(personalInterestsCreateController.getPersonalInterestsView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/personal-interests', [
    checkInductionDtoExistsInJourneyData,
    validate(personalInterestsSchema),
    asyncMiddleware(personalInterestsCreateController.submitPersonalInterestsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/affect-ability-to-work', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(affectAbilityToWorkCreateController.getAffectAbilityToWorkView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/affect-ability-to-work', [
    checkInductionDtoExistsInJourneyData,
    validate(affectAbilityToWorkSchema),
    asyncMiddleware(affectAbilityToWorkCreateController.submitAffectAbilityToWorkForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/in-prison-work', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(inPrisonWorkCreateController.getInPrisonWorkView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/in-prison-work', [
    checkInductionDtoExistsInJourneyData,
    validate(inPrisonWorkSchema),
    asyncMiddleware(inPrisonWorkCreateController.submitInPrisonWorkForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/in-prison-training', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(inPrisonTrainingCreateController.getInPrisonTrainingView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/in-prison-training', [
    checkInductionDtoExistsInJourneyData,
    validate(inPrisonTrainingSchema),
    asyncMiddleware(inPrisonTrainingCreateController.submitInPrisonTrainingForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/who-completed-induction', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(whoCompletedInductionController.getWhoCompletedInductionView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/who-completed-induction', [
    checkInductionDtoExistsInJourneyData,
    validate(whoCompletedInductionSchema),
    asyncMiddleware(whoCompletedInductionController.submitWhoCompletedInductionForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/notes', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(inductionNoteController.getInductionNoteView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/notes', [
    checkInductionDtoExistsInJourneyData,
    validate(inductionNoteSchema),
    asyncMiddleware(inductionNoteController.submitInductionNoteForm),
  ])

  router.get('/prisoners/:prisonNumber/create-induction/:journeyId/check-your-answers', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(checkYourAnswersCreateController.getCheckYourAnswersView),
  ])
  router.post('/prisoners/:prisonNumber/create-induction/:journeyId/check-your-answers', [
    checkInductionDtoExistsInJourneyData,
    asyncMiddleware(checkYourAnswersCreateController.submitCheckYourAnswers),
  ])
}
