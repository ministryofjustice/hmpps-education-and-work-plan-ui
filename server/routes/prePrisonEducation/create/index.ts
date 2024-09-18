import { Router } from 'express'
import { Services } from '../../../services'
import retrieveCuriousFunctionalSkills from '../../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrieveCuriousInPrisonCourses from '../../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { checkUserHasEditAuthority } from '../../../middleware/roleBasedAccessControl'
import createEmptyEducationDtoIfNotInSession from '../../routerRequestHandlers/createEmptyEducationDtoIfNotInPrisonerContext'
import checkEducationDtoExistsInPrisonerContext from '../../routerRequestHandlers/checkEducationDtoExistsInPrisonerContext'
import QualificationLevelCreateController from './qualificationLevelCreateController'
import QualificationDetailsCreateController from './qualificationDetailsCreateController'
import HighestLevelOfEducationCreateController from './highestLevelOfEducationCreateController'
import QualificationsListCreateController from './qualificationsListCreateController'

/**
 * Route definitions for creating a prisoner's qualifications before an Induction
 *
 */
export default (router: Router, services: Services) => {
  const { educationAndWorkPlanService } = services
  const highestLevelOfEducationCreateController = new HighestLevelOfEducationCreateController()
  const qualificationLevelCreateController = new QualificationLevelCreateController()
  const qualificationDetailsCreateController = new QualificationDetailsCreateController()
  const qualificationsListCreateController = new QualificationsListCreateController(educationAndWorkPlanService)

  router.use('/prisoners/:prisonNumber/create-education/highest-level-of-education', [
    checkUserHasEditAuthority(),
    createEmptyEducationDtoIfNotInSession,
  ])
  router.get('/prisoners/:prisonNumber/create-education/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationCreateController.getHighestLevelOfEducationView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationCreateController.submitHighestLevelOfEducationForm),
  ])

  router.use('/prisoners/:prisonNumber/create-education/qualification-level', [
    checkUserHasEditAuthority(),
    checkEducationDtoExistsInPrisonerContext,
  ])
  router.get('/prisoners/:prisonNumber/create-education/qualification-level', [
    asyncMiddleware(qualificationLevelCreateController.getQualificationLevelView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/qualification-level', [
    asyncMiddleware(qualificationLevelCreateController.submitQualificationLevelForm),
  ])

  router.use('/prisoners/:prisonNumber/create-education/qualification-details', [
    checkUserHasEditAuthority(),
    checkEducationDtoExistsInPrisonerContext,
  ])
  router.get('/prisoners/:prisonNumber/create-education/qualification-details', [
    asyncMiddleware(qualificationDetailsCreateController.getQualificationDetailsView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/qualification-details', [
    asyncMiddleware(qualificationDetailsCreateController.submitQualificationDetailsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-education/qualifications', [
    checkUserHasEditAuthority(),
    checkEducationDtoExistsInPrisonerContext,
  ])
  router.get('/prisoners/:prisonNumber/create-education/qualifications', [
    retrieveCuriousFunctionalSkills(services.curiousService),
    retrieveCuriousInPrisonCourses(services.curiousService),
    asyncMiddleware(qualificationsListCreateController.getQualificationsListView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/qualifications', [
    asyncMiddleware(qualificationsListCreateController.submitQualificationsListView),
  ])
}
