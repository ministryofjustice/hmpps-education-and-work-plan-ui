import { Router } from 'express'
import { Services } from '../../services'
import retrieveCuriousFunctionalSkills from '../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrieveCuriousInPrisonCourses from '../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import createEmptyEducationDtoIfNotInSession from '../routerRequestHandlers/createEmptyEducationDtoIfNotInPrisonerContext'
import HighestLevelOfEducationController from './highestLevelOfEducationController'
import QualificationLevelController from './qualificationLevelController'
import QualificationDetailsController from './qualificationDetailsController'
import checkEducationDtoExistsInPrisonerContext from '../routerRequestHandlers/checkEducationDtoExistsInPrisonerContext'
import QualificationsListController from './qualificationsListController'

/**
 * Route definitions for creating a prisoner's qualifications before an Induction
 *
 */
export default (router: Router, services: Services) => {
  const { educationAndWorkPlanService } = services
  const highestLevelOfEducationController = new HighestLevelOfEducationController()
  const qualificationLevelController = new QualificationLevelController()
  const qualificationDetailsController = new QualificationDetailsController()
  const qualificationsListController = new QualificationsListController(educationAndWorkPlanService)

  router.use('/prisoners/:prisonNumber/highest-level-of-education', [
    checkUserHasEditAuthority(),
    createEmptyEducationDtoIfNotInSession,
  ])
  router.get('/prisoners/:prisonNumber/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationController.getHighestLevelOfEducationView),
  ])
  router.post('/prisoners/:prisonNumber/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationController.submitHighestLevelOfEducationForm),
  ])

  router.use('/prisoners/:prisonNumber/qualification-level', [
    checkUserHasEditAuthority(),
    checkEducationDtoExistsInPrisonerContext,
  ])
  router.get('/prisoners/:prisonNumber/qualification-level', [
    asyncMiddleware(qualificationLevelController.getQualificationLevelView),
  ])
  router.post('/prisoners/:prisonNumber/qualification-level', [
    asyncMiddleware(qualificationLevelController.submitQualificationLevelForm),
  ])

  router.use('/prisoners/:prisonNumber/qualification-details', [
    checkUserHasEditAuthority(),
    checkEducationDtoExistsInPrisonerContext,
  ])
  router.get('/prisoners/:prisonNumber/qualification-details', [
    asyncMiddleware(qualificationDetailsController.getQualificationDetailsView),
  ])
  router.post('/prisoners/:prisonNumber/qualification-details', [
    asyncMiddleware(qualificationDetailsController.submitQualificationDetailsForm),
  ])

  router.get('/prisoners/:prisonNumber/qualifications', [
    checkUserHasEditAuthority(),
    checkEducationDtoExistsInPrisonerContext,
  ])
  router.get('/prisoners/:prisonNumber/qualifications', [
    retrieveCuriousFunctionalSkills(services.curiousService),
    retrieveCuriousInPrisonCourses(services.curiousService),
    asyncMiddleware(qualificationsListController.getQualificationsListView),
  ])
  router.post('/prisoners/:prisonNumber/qualifications', [
    asyncMiddleware(qualificationsListController.submitQualificationsListView),
  ])
}
