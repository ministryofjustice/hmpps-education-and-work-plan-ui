import { Router } from 'express'
import { Services } from '../../services'
import retrieveCuriousFunctionalSkills from '../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrieveCuriousInPrisonCourses from '../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import createEmptyInductionIfNotInSession from '../routerRequestHandlers/createEmptyEducationDtoIfNotInPrisonerContext'
import HighestLevelOfEducationController from './highestLevelOfEducationController'

/**
 * Route definitions for creating a prisoner's qualifications before an Induction
 *
 */
export default (router: Router, services: Services) => {
  const highestLevelOfEducationController = new HighestLevelOfEducationController()

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

  router.get('/prisoners/:prisonNumber/qualification-level', [checkUserHasEditAuthority()])
  router.post('/prisoners/:prisonNumber/qualification-level', [checkUserHasEditAuthority()])

  router.get('/prisoners/:prisonNumber/qualification-details', [checkUserHasEditAuthority()])
  router.post('/prisoners/:prisonNumber/qualification-details', [checkUserHasEditAuthority()])

  router.get('/prisoners/:prisonNumber/qualifications', [
    checkUserHasEditAuthority(),
    retrieveCuriousFunctionalSkills(services.curiousService),
    retrieveCuriousInPrisonCourses(services.curiousService),
  ])
  router.post('/prisoners/:prisonNumber/qualifications', [checkUserHasEditAuthority()])
}
