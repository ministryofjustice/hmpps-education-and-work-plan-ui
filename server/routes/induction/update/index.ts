import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import InPrisonWorkUpdateController from './inPrisonWorkUpdateController'
import InPrisonTrainingUpdateController from './inPrisonTrainingUpdateController'
import SkillsUpdateController from './skillsUpdateController'
import PersonalInterestsUpdateController from './personalInterestsUpdateController'
import WorkedBeforeUpdateController from './workedBeforeUpdateController'
import PreviousWorkExperienceDetailUpdateController from './previousWorkExperienceDetailUpdateController'
import PreviousWorkExperienceTypesUpdateController from './previousWorkExperienceTypesUpdateController'
import AffectAbilityToWorkUpdateController from './affectAbilityToWorkUpdateController'
import WorkInterestTypesUpdateController from './workInterestTypesUpdateController'
import WorkInterestRolesUpdateController from './workInterestRolesUpdateController'
import AdditionalTrainingUpdateController from './additionalTrainingUpdateController'
import HopingToWorkOnReleaseUpdateController from './hopingToWorkOnReleaseUpdateController'
import setCurrentPageInPageFlowQueue from '../../routerRequestHandlers/setCurrentPageInPageFlowQueue'
import retrieveInductionIfNotInJourneyData from '../../routerRequestHandlers/retrieveInductionIfNotInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../routerRequestHandlers/insertJourneyIdentifier'
import setupJourneyData from '../../routerRequestHandlers/setupJourneyData'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import {
  additionalTrainingSchema,
  affectAbilityToWorkSchema,
  hopingToWorkOnReleaseSchema,
  inPrisonTrainingSchema,
  inPrisonWorkSchema,
  personalInterestsSchema,
  previousWorkExperienceDetailSchema,
  previousWorkExperienceTypesSchema,
  skillsSchema,
  workedBeforeSchema,
  workInterestRolesSchema,
  workInterestTypesSchema,
} from '../validationSchemas'
import { checkRedirectAtEndOfJourneyIsNotPending } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Route definitions for updating the various sections of an Induction
 *
 * All routes adopt the pattern:
 * /prisoners/<prison-number>/induction/<page-or-section-id>
 */
export default (router: Router, services: Services) => {
  const { inductionService, journeyDataService } = services
  const hopingToWorkOnReleaseController = new HopingToWorkOnReleaseUpdateController(inductionService)
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
  const workInterestTypesUpdateController = new WorkInterestTypesUpdateController(inductionService)
  const workInterestRolesUpdateController = new WorkInterestRolesUpdateController(inductionService)
  const additionalTrainingUpdateController = new AdditionalTrainingUpdateController(inductionService)

  router.use('/prisoners/:prisonNumber/induction', [
    checkUserHasPermissionTo(ApplicationAction.UPDATE_INDUCTION),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/prisoners/:prisonNumber/induction' - eg: '/prisoners/A1234BC/induction/473e9ee4-37d6-4afb-92a2-5729b10cc60f/hoping-to-work-on-release'
  ])
  router.use('/prisoners/:prisonNumber/induction/:journeyId', [
    setupJourneyData(journeyDataService),
    retrieveInductionIfNotInJourneyData(services.inductionService),
    setCurrentPageInPageFlowQueue,
  ])

  // In Prison Training
  router.get('/prisoners/:prisonNumber/induction/:journeyId/in-prison-training', [
    asyncMiddleware(inPrisonTrainingUpdateController.getInPrisonTrainingView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/in-prison-training', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction In-prison Training',
      redirectTo: '/plan/:prisonNumber/view/education-and-training',
    }),
    validate(inPrisonTrainingSchema),
    asyncMiddleware(inPrisonTrainingUpdateController.submitInPrisonTrainingForm),
  ])

  // Personal Skills and Interests
  router.get('/prisoners/:prisonNumber/induction/:journeyId/personal-interests', [
    asyncMiddleware(personalInterestsUpdateController.getPersonalInterestsView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/personal-interests', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction Personal Interests',
      redirectTo: '/plan/:prisonNumber/view/work-and-interests',
    }),
    validate(personalInterestsSchema),
    asyncMiddleware(personalInterestsUpdateController.submitPersonalInterestsForm),
  ])

  router.get('/prisoners/:prisonNumber/induction/:journeyId/skills', [
    asyncMiddleware(skillsUpdateController.getSkillsView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/skills', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction Personal Skills',
      redirectTo: '/plan/:prisonNumber/view/work-and-interests',
    }),
    validate(skillsSchema),
    asyncMiddleware(skillsUpdateController.submitSkillsForm),
  ])

  // Previous Work Experience
  router.get('/prisoners/:prisonNumber/induction/:journeyId/has-worked-before', [
    asyncMiddleware(workedBeforeUpdateController.getWorkedBeforeView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/has-worked-before', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction Has Worked Before',
      redirectTo: '/plan/:prisonNumber/view/work-and-interests',
    }),
    validate(workedBeforeSchema),
    asyncMiddleware(workedBeforeUpdateController.submitWorkedBeforeForm),
  ])

  router.get('/prisoners/:prisonNumber/induction/:journeyId/previous-work-experience', [
    asyncMiddleware(previousWorkExperienceTypesUpdateController.getPreviousWorkExperienceTypesView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/previous-work-experience', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction Previous Work Experience Types',
      redirectTo: '/plan/:prisonNumber/view/work-and-interests',
    }),
    validate(previousWorkExperienceTypesSchema),
    asyncMiddleware(previousWorkExperienceTypesUpdateController.submitPreviousWorkExperienceTypesForm),
  ])

  router.get('/prisoners/:prisonNumber/induction/:journeyId/previous-work-experience/:typeOfWorkExperience', [
    asyncMiddleware(previousWorkExperienceDetailUpdateController.getPreviousWorkExperienceDetailView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/previous-work-experience/:typeOfWorkExperience', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction Previous Work Experience Detail',
      redirectTo: '/plan/:prisonNumber/view/work-and-interests',
    }),
    validate(previousWorkExperienceDetailSchema),
    asyncMiddleware(previousWorkExperienceDetailUpdateController.submitPreviousWorkExperienceDetailForm),
  ])

  // Work Interests
  router.get('/prisoners/:prisonNumber/induction/:journeyId/hoping-to-work-on-release', [
    asyncMiddleware(hopingToWorkOnReleaseController.getHopingToWorkOnReleaseView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/hoping-to-work-on-release', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction Hoping To Work On Release',
      redirectTo: '/plan/:prisonNumber/view/work-and-interests',
    }),
    validate(hopingToWorkOnReleaseSchema),
    asyncMiddleware(hopingToWorkOnReleaseController.submitHopingToWorkOnReleaseForm),
  ])

  router.get('/prisoners/:prisonNumber/induction/:journeyId/affect-ability-to-work', [
    asyncMiddleware(affectAbilityToWorkUpdateController.getAffectAbilityToWorkView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/affect-ability-to-work', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction Affect Ability To Work',
      redirectTo: '/plan/:prisonNumber/view/work-and-interests',
    }),
    validate(affectAbilityToWorkSchema),
    asyncMiddleware(affectAbilityToWorkUpdateController.submitAffectAbilityToWorkForm),
  ])

  router.get('/prisoners/:prisonNumber/induction/:journeyId/work-interest-types', [
    asyncMiddleware(workInterestTypesUpdateController.getWorkInterestTypesView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/work-interest-types', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction Work Interest Types',
      redirectTo: '/plan/:prisonNumber/view/work-and-interests',
    }),
    validate(workInterestTypesSchema),
    asyncMiddleware(workInterestTypesUpdateController.submitWorkInterestTypesForm),
  ])

  router.get('/prisoners/:prisonNumber/induction/:journeyId/work-interest-roles', [
    asyncMiddleware(workInterestRolesUpdateController.getWorkInterestRolesView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/work-interest-roles', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction Work Interest Roles',
      redirectTo: '/plan/:prisonNumber/view/work-and-interests',
    }),
    validate(workInterestRolesSchema),
    asyncMiddleware(workInterestRolesUpdateController.submitWorkInterestRolesForm),
  ])

  router.get('/prisoners/:prisonNumber/induction/:journeyId/in-prison-work', [
    asyncMiddleware(inPrisonWorkUpdateController.getInPrisonWorkView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/in-prison-work', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction Work In-prison Work Interests',
      redirectTo: '/plan/:prisonNumber/view/work-and-interests',
    }),
    validate(inPrisonWorkSchema),
    asyncMiddleware(inPrisonWorkUpdateController.submitInPrisonWorkForm),
  ])

  router.get('/prisoners/:prisonNumber/induction/:journeyId/additional-training', [
    asyncMiddleware(additionalTrainingUpdateController.getAdditionalTrainingView),
  ])
  router.post('/prisoners/:prisonNumber/induction/:journeyId/additional-training', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Induction Additional Training',
      redirectTo: '/plan/:prisonNumber/view/education-and-training',
    }),
    validate(additionalTrainingSchema),
    asyncMiddleware(additionalTrainingUpdateController.submitAdditionalTrainingForm),
  ])
}
