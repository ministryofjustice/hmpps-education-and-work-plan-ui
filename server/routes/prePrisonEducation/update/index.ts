import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../../../services'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import HighestLevelOfEducationUpdateController from './highestLevelOfEducationUpdateController'
import retrieveEducationForUpdate from '../../routerRequestHandlers/retrieveEducationForUpdate'
import QualificationLevelUpdateController from './qualificationLevelUpdateController'
import QualificationDetailsUpdateController from './qualificationDetailsUpdateController'
import QualificationsListUpdateController from './qualificationsListUpdateController'
import checkEducationDtoExistsInJourneyData from '../../routerRequestHandlers/checkEducationDtoExistsInJourneyData'
import retrieveCuriousFunctionalSkills from '../../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrieveCuriousInPrisonCourses from '../../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../routerRequestHandlers/insertJourneyIdentifier'
import setupJourneyData from '../../routerRequestHandlers/setupJourneyData'
import retrievePrisonNamesById from '../../routerRequestHandlers/retrievePrisonNamesById'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import {
  highestLevelOfEducationSchema,
  qualificationLevelSchema,
  qualificationDetailsSchema,
} from '../../induction/validationSchemas'
import { checkRedirectAtEndOfJourneyIsNotPending } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'
import retrieveVerifiedQualifications from '../../routerRequestHandlers/retrieveVerifiedQualifications'

/**
 * Route definitions for updating a prisoner's qualifications
 *
 */
export default (router: Router, services: Services) => {
  const { curiousService, educationAndWorkPlanService, journeyDataService, learnerRecordsService, prisonService } =
    services
  const highestLevelOfEducationUpdateController = new HighestLevelOfEducationUpdateController(
    educationAndWorkPlanService,
  )
  const qualificationLevelUpdateController = new QualificationLevelUpdateController()
  const qualificationDetailsUpdateController = new QualificationDetailsUpdateController()
  const qualificationsListUpdateController = new QualificationsListUpdateController(educationAndWorkPlanService)

  router.use('/prisoners/:prisonNumber/education', [
    checkUserHasPermissionTo(ApplicationAction.UPDATE_EDUCATION),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/prisoners/:prisonNumber/education' - eg: '/prisoners/A1234BC/education/473e9ee4-37d6-4afb-92a2-5729b10cc60f/highest-level-of-education'
  ])
  router.use('/prisoners/:prisonNumber/education/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/prisoners/:prisonNumber/education/:journeyId/add-qualifications', [
    retrieveEducationForUpdate(educationAndWorkPlanService),
    asyncMiddleware((req: Request, res: Response, next: NextFunction) => {
      const { prisonNumber, journeyId } = req.params
      res.redirect(`/prisoners/${prisonNumber}/education/${journeyId}/qualification-level`)
    }),
  ])

  router.use('/prisoners/:prisonNumber/education/:journeyId/highest-level-of-education', [
    retrieveEducationForUpdate(educationAndWorkPlanService),
  ])
  router.get('/prisoners/:prisonNumber/education/:journeyId/highest-level-of-education', [
    asyncMiddleware(highestLevelOfEducationUpdateController.getHighestLevelOfEducationView),
  ])
  router.post('/prisoners/:prisonNumber/education/:journeyId/highest-level-of-education', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Highest Level of Education',
      redirectTo: '/plan/:prisonNumber/view/education-and-training',
    }),
    validate(highestLevelOfEducationSchema),
    asyncMiddleware(highestLevelOfEducationUpdateController.submitHighestLevelOfEducationForm),
  ])

  router.get('/prisoners/:prisonNumber/education/:journeyId/qualifications', [
    retrievePrisonNamesById(prisonService),
    retrieveEducationForUpdate(educationAndWorkPlanService),
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    retrieveVerifiedQualifications(learnerRecordsService),
    asyncMiddleware(qualificationsListUpdateController.getQualificationsListView),
  ])
  router.post('/prisoners/:prisonNumber/education/:journeyId/qualifications', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Pre-prison Qualifications',
      redirectTo: '/plan/:prisonNumber/view/education-and-training',
    }),
    asyncMiddleware(qualificationsListUpdateController.submitQualificationsListView),
  ])

  router.use('/prisoners/:prisonNumber/education/:journeyId/qualification-level', [
    checkEducationDtoExistsInJourneyData,
  ])
  router.get('/prisoners/:prisonNumber/education/:journeyId/qualification-level', [
    asyncMiddleware(qualificationLevelUpdateController.getQualificationLevelView),
  ])
  router.post('/prisoners/:prisonNumber/education/:journeyId/qualification-level', [
    validate(qualificationLevelSchema),
    asyncMiddleware(qualificationLevelUpdateController.submitQualificationLevelForm),
  ])

  router.use('/prisoners/:prisonNumber/education/:journeyId/qualification-details', [
    checkEducationDtoExistsInJourneyData,
  ])
  router.get('/prisoners/:prisonNumber/education/:journeyId/qualification-details', [
    asyncMiddleware(qualificationDetailsUpdateController.getQualificationDetailsView),
  ])
  router.post('/prisoners/:prisonNumber/education/:journeyId/qualification-details', [
    validate(qualificationDetailsSchema),
    asyncMiddleware(qualificationDetailsUpdateController.submitQualificationDetailsForm),
  ])
}
