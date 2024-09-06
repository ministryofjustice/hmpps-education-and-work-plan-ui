import { Router } from 'express'
import { Services } from '../../services'
import retrieveCuriousFunctionalSkills from '../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrieveCuriousInPrisonCourses from '../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import createEmptyInductionIfNotInSession from '../routerRequestHandlers/createEmptyEducationDtoIfNotInPrisonerContext'
import HighestLevelOfEducationController from './highestLevelOfEducationController'
import QualificationLevelController from './qualificationLevelController'
import checkEducationDtoExistsInPrisonerContext from '../routerRequestHandlers/checkEducationDtoExistsInPrisonerContext'

/**
 * Route definitions for creating a prisoner's qualifications before an Induction
 *
 */
export default (router: Router, services: Services) => {
  const highestLevelOfEducationController = new HighestLevelOfEducationController()
  const qualificationLevelController = new QualificationLevelController()

  router.use('/prisoners/:prisonNumber/highest-level-of-education', [
    checkUserHasEditAuthority(),
    createEmptyInductionIfNotInSession,
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

  router.get('/prisoners/:prisonNumber/qualification-details', [checkUserHasEditAuthority()])
  router.post('/prisoners/:prisonNumber/qualification-details', [checkUserHasEditAuthority()])

  router.get('/prisoners/:prisonNumber/qualifications', [
    checkUserHasEditAuthority(),
    retrieveCuriousFunctionalSkills(services.curiousService),
    retrieveCuriousInPrisonCourses(services.curiousService),
  ])
  router.post('/prisoners/:prisonNumber/qualifications', [checkUserHasEditAuthority()])
}
