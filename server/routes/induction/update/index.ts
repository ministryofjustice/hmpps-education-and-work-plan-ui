import { Router } from 'express'
import { Services } from '../../../services'
import config from '../../../config'
import { checkUserHasEditAuthority } from '../../../middleware/roleBasedAccessControl'
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
import HighestLevelOfEducationUpdateController from './highestLevelOfEducationUpdateController'
import AdditionalTrainingUpdateController from './additionalTrainingUpdateController'
import QualificationsListUpdateController from './qualificationsListUpdateController'
import QualificationLevelUpdateController from './qualificationLevelUpdateController'
import QualificationDetailsUpdateController from './qualificationDetailsUpdateController'
import HopingToWorkOnReleaseUpdateController from './hopingToWorkOnReleaseUpdateController'
import WantToAddQualificationsUpdateController from './wantToAddQualificationsUpdateController'
import setCurrentPageInPageFlowQueue from '../../routerRequestHandlers/setCurrentPageInPageFlowQueue'
import retrieveCuriousFunctionalSkills from '../../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrieveInductionIfNotInSession from '../../routerRequestHandlers/retrieveInductionIfNotInSession'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrieveCuriousInPrisonCourses from '../../routerRequestHandlers/retrieveCuriousInPrisonCourses'

/**
 * Route definitions for updating the various sections of an Induction
 *
 * All routes adopt the pattern:
 * /prisoners/<prison-number>/induction/<page-or-section-id>
 */
export default (router: Router, services: Services) => {
  const { inductionService } = services
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
  const highestLevelOfEducationUpdateController = new HighestLevelOfEducationUpdateController(inductionService)
  const qualificationLevelUpdateController = new QualificationLevelUpdateController()
  const qualificationDetailsUpdateController = new QualificationDetailsUpdateController()
  const additionalTrainingUpdateController = new AdditionalTrainingUpdateController(inductionService)
  const qualificationsListUpdateController = new QualificationsListUpdateController(inductionService)
  const wantToAddQualificationsUpdateController = new WantToAddQualificationsUpdateController()

  if (config.featureToggles.induction.update.enabled) {
    router.get('/prisoners/:prisonNumber/induction/**', [
      checkUserHasEditAuthority(),
      retrieveInductionIfNotInSession(services.inductionService),
      setCurrentPageInPageFlowQueue,
    ])
    router.post('/prisoners/:prisonNumber/induction/**', [
      checkUserHasEditAuthority(),
      retrieveInductionIfNotInSession(services.inductionService),
      setCurrentPageInPageFlowQueue,
    ])

    // In Prison Training
    router.get('/prisoners/:prisonNumber/induction/in-prison-training', [
      asyncMiddleware(inPrisonTrainingUpdateController.getInPrisonTrainingView),
    ])
    router.post('/prisoners/:prisonNumber/induction/in-prison-training', [
      asyncMiddleware(inPrisonTrainingUpdateController.submitInPrisonTrainingForm),
    ])

    // Personal Skills and Interests
    router.get('/prisoners/:prisonNumber/induction/personal-interests', [
      asyncMiddleware(personalInterestsUpdateController.getPersonalInterestsView),
    ])
    router.post('/prisoners/:prisonNumber/induction/personal-interests', [
      asyncMiddleware(personalInterestsUpdateController.submitPersonalInterestsForm),
    ])

    router.get('/prisoners/:prisonNumber/induction/skills', [asyncMiddleware(skillsUpdateController.getSkillsView)])
    router.post('/prisoners/:prisonNumber/induction/skills', [asyncMiddleware(skillsUpdateController.submitSkillsForm)])

    // Previous Work Experience
    router.get('/prisoners/:prisonNumber/induction/has-worked-before', [
      asyncMiddleware(workedBeforeUpdateController.getWorkedBeforeView),
    ])
    router.post('/prisoners/:prisonNumber/induction/has-worked-before', [
      asyncMiddleware(workedBeforeUpdateController.submitWorkedBeforeForm),
    ])

    router.get('/prisoners/:prisonNumber/induction/previous-work-experience', [
      asyncMiddleware(previousWorkExperienceTypesUpdateController.getPreviousWorkExperienceTypesView),
    ])
    router.post('/prisoners/:prisonNumber/induction/previous-work-experience', [
      asyncMiddleware(previousWorkExperienceTypesUpdateController.submitPreviousWorkExperienceTypesForm),
    ])

    router.get('/prisoners/:prisonNumber/induction/previous-work-experience/:typeOfWorkExperience', [
      asyncMiddleware(previousWorkExperienceDetailUpdateController.getPreviousWorkExperienceDetailView),
    ])
    router.post('/prisoners/:prisonNumber/induction/previous-work-experience/:typeOfWorkExperience', [
      asyncMiddleware(previousWorkExperienceDetailUpdateController.submitPreviousWorkExperienceDetailForm),
    ])

    // Work Interests
    router.get('/prisoners/:prisonNumber/induction/hoping-to-work-on-release', [
      asyncMiddleware(hopingToWorkOnReleaseController.getHopingToWorkOnReleaseView),
    ])
    router.post('/prisoners/:prisonNumber/induction/hoping-to-work-on-release', [
      asyncMiddleware(hopingToWorkOnReleaseController.submitHopingToWorkOnReleaseForm),
    ])

    router.get('/prisoners/:prisonNumber/induction/affect-ability-to-work', [
      asyncMiddleware(affectAbilityToWorkUpdateController.getAffectAbilityToWorkView),
    ])
    router.post('/prisoners/:prisonNumber/induction/affect-ability-to-work', [
      asyncMiddleware(affectAbilityToWorkUpdateController.submitAffectAbilityToWorkForm),
    ])

    router.get('/prisoners/:prisonNumber/induction/work-interest-types', [
      asyncMiddleware(workInterestTypesUpdateController.getWorkInterestTypesView),
    ])
    router.post('/prisoners/:prisonNumber/induction/work-interest-types', [
      asyncMiddleware(workInterestTypesUpdateController.submitWorkInterestTypesForm),
    ])

    router.get('/prisoners/:prisonNumber/induction/work-interest-roles', [
      asyncMiddleware(workInterestRolesUpdateController.getWorkInterestRolesView),
    ])
    router.post('/prisoners/:prisonNumber/induction/work-interest-roles', [
      asyncMiddleware(workInterestRolesUpdateController.submitWorkInterestRolesForm),
    ])

    router.get('/prisoners/:prisonNumber/induction/in-prison-work', [
      asyncMiddleware(inPrisonWorkUpdateController.getInPrisonWorkView),
    ])
    router.post('/prisoners/:prisonNumber/induction/in-prison-work', [
      asyncMiddleware(inPrisonWorkUpdateController.submitInPrisonWorkForm),
    ])

    // Pre Prison Education
    router.get('/prisoners/:prisonNumber/induction/qualifications', [
      retrieveCuriousFunctionalSkills(services.curiousService),
      retrieveCuriousInPrisonCourses(services.curiousService),
      asyncMiddleware(qualificationsListUpdateController.getQualificationsListView),
    ])
    router.post('/prisoners/:prisonNumber/induction/qualifications', [
      asyncMiddleware(qualificationsListUpdateController.submitQualificationsListView),
    ])

    router.get('/prisoners/:prisonNumber/induction/want-to-add-qualifications', [
      retrieveCuriousFunctionalSkills(services.curiousService),
      retrieveCuriousInPrisonCourses(services.curiousService),
      asyncMiddleware(wantToAddQualificationsUpdateController.getWantToAddQualificationsView),
    ])
    router.post('/prisoners/:prisonNumber/induction/want-to-add-qualifications', [
      asyncMiddleware(wantToAddQualificationsUpdateController.submitWantToAddQualificationsForm),
    ])

    router.get('/prisoners/:prisonNumber/induction/highest-level-of-education', [
      asyncMiddleware(highestLevelOfEducationUpdateController.getHighestLevelOfEducationView),
    ])
    router.post('/prisoners/:prisonNumber/induction/highest-level-of-education', [
      asyncMiddleware(highestLevelOfEducationUpdateController.submitHighestLevelOfEducationForm),
    ])

    router.get('/prisoners/:prisonNumber/induction/qualification-level', [
      asyncMiddleware(qualificationLevelUpdateController.getQualificationLevelView),
    ])
    router.post('/prisoners/:prisonNumber/induction/qualification-level', [
      asyncMiddleware(qualificationLevelUpdateController.submitQualificationLevelForm),
    ])

    router.get('/prisoners/:prisonNumber/induction/qualification-details', [
      asyncMiddleware(qualificationDetailsUpdateController.getQualificationDetailsView),
    ])
    router.post('/prisoners/:prisonNumber/induction/qualification-details', [
      asyncMiddleware(qualificationDetailsUpdateController.submitQualificationDetailsForm),
    ])

    router.get('/prisoners/:prisonNumber/induction/additional-training', [
      asyncMiddleware(additionalTrainingUpdateController.getAdditionalTrainingView),
    ])
    router.post('/prisoners/:prisonNumber/induction/additional-training', [
      asyncMiddleware(additionalTrainingUpdateController.submitAdditionalTrainingForm),
    ])
  }
}
