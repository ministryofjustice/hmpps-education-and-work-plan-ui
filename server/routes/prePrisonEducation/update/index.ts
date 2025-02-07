import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../../../services'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import HighestLevelOfEducationUpdateController from './highestLevelOfEducationUpdateController'
import retrieveEducationForUpdate from '../../routerRequestHandlers/retrieveEducationForUpdate'
import QualificationLevelUpdateController from './qualificationLevelUpdateController'
import QualificationDetailsUpdateController from './qualificationDetailsUpdateController'
import QualificationsListUpdateController from './qualificationsListUpdateController'
import checkEducationDtoExistsInPrisonerContext from '../../routerRequestHandlers/checkEducationDtoExistsInPrisonerContext'
import retrieveCuriousFunctionalSkills from '../../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrieveCuriousInPrisonCourses from '../../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import ApplicationAction from '../../../enums/applicationAction'

/**
 * Route definitions for updating a prisoner's qualifications
 *
 */
export default (router: Router, services: Services) => {
  const { educationAndWorkPlanService } = services
  const highestLevelOfEducationUpdateController = new HighestLevelOfEducationUpdateController(
    educationAndWorkPlanService,
  )
  const qualificationLevelUpdateController = new QualificationLevelUpdateController()
  const qualificationDetailsUpdateController = new QualificationDetailsUpdateController()
  const qualificationsListUpdateController = new QualificationsListUpdateController(educationAndWorkPlanService)

  router.use('/prisoners/:prisonNumber/education/*', [checkUserHasPermissionTo(ApplicationAction.UPDATE_EDUCATION)])

  router.get('/prisoners/:prisonNumber/education/add-qualifications', [
    retrieveEducationForUpdate(educationAndWorkPlanService),
    asyncMiddleware((req: Request, res: Response, next: NextFunction) => {
      const { prisonNumber } = req.params
      res.redirect(`/prisoners/${prisonNumber}/education/qualification-level`)
    }),
  ])

  router.use('/prisoners/:prisonNumber/education/highest-level-of-education', [
    retrieveEducationForUpdate(educationAndWorkPlanService),
  ])
  router.get('/prisoners/:prisonNumber/education/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationUpdateController.getHighestLevelOfEducationView),
  ])
  router.post('/prisoners/:prisonNumber/education/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationUpdateController.submitHighestLevelOfEducationForm),
  ])

  router.get('/prisoners/:prisonNumber/education/qualifications', [
    retrieveEducationForUpdate(educationAndWorkPlanService),
    retrieveCuriousFunctionalSkills(services.curiousService),
    retrieveCuriousInPrisonCourses(services.curiousService),
    asyncMiddleware(qualificationsListUpdateController.getQualificationsListView),
  ])
  router.post('/prisoners/:prisonNumber/education/qualifications', [
    asyncMiddleware(qualificationsListUpdateController.submitQualificationsListView),
  ])

  router.use('/prisoners/:prisonNumber/education/qualification-level', [checkEducationDtoExistsInPrisonerContext])
  router.get('/prisoners/:prisonNumber/education/qualification-level', [
    asyncMiddleware(qualificationLevelUpdateController.getQualificationLevelView),
  ])
  router.post('/prisoners/:prisonNumber/education/qualification-level', [
    asyncMiddleware(qualificationLevelUpdateController.submitQualificationLevelForm),
  ])

  router.use('/prisoners/:prisonNumber/education/qualification-details', [checkEducationDtoExistsInPrisonerContext])
  router.get('/prisoners/:prisonNumber/education/qualification-details', [
    asyncMiddleware(qualificationDetailsUpdateController.getQualificationDetailsView),
  ])
  router.post('/prisoners/:prisonNumber/education/qualification-details', [
    asyncMiddleware(qualificationDetailsUpdateController.submitQualificationDetailsForm),
  ])
}
