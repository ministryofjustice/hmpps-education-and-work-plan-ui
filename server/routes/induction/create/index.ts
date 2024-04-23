import { Router } from 'express'
import { Services } from '../../../services'
import config from '../../../config'
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
  }
}
