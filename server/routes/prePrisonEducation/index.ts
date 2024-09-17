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

  router.use('/prisoners/:prisonNumber/create-education/highest-level-of-education', [
    checkUserHasEditAuthority(),
    createEmptyEducationDtoIfNotInSession,
  ])
  router.get('/prisoners/:prisonNumber/create-education/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationController.getHighestLevelOfEducationView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationController.submitHighestLevelOfEducationForm),
  ])

  router.use('/prisoners/:prisonNumber/create-education/qualification-level', [
    checkUserHasEditAuthority(),
    checkEducationDtoExistsInPrisonerContext,
  ])
  router.get('/prisoners/:prisonNumber/create-education/qualification-level', [
    asyncMiddleware(qualificationLevelController.getQualificationLevelView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/qualification-level', [
    asyncMiddleware(qualificationLevelController.submitQualificationLevelForm),
  ])

  router.use('/prisoners/:prisonNumber/create-education/qualification-details', [
    checkUserHasEditAuthority(),
    checkEducationDtoExistsInPrisonerContext,
  ])
  router.get('/prisoners/:prisonNumber/create-education/qualification-details', [
    asyncMiddleware(qualificationDetailsController.getQualificationDetailsView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/qualification-details', [
    asyncMiddleware(qualificationDetailsController.submitQualificationDetailsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-education/qualifications', [
    checkUserHasEditAuthority(),
    checkEducationDtoExistsInPrisonerContext,
  ])
  router.get('/prisoners/:prisonNumber/create-education/qualifications', [
    retrieveCuriousFunctionalSkills(services.curiousService),
    retrieveCuriousInPrisonCourses(services.curiousService),
    asyncMiddleware(qualificationsListController.getQualificationsListView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/qualifications', [
    asyncMiddleware(qualificationsListController.submitQualificationsListView),
  ])
}
