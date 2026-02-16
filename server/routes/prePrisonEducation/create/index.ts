import { Router } from 'express'
import { Services } from '../../../services'
import retrieveCuriousFunctionalSkills from '../../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrieveCuriousInPrisonCourses from '../../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import createEmptyEducationDtoIfNotInJourneyData from '../../routerRequestHandlers/createEmptyEducationDtoIfNotInJourneyData'
import checkEducationDtoExistsInJourneyData from '../../routerRequestHandlers/checkEducationDtoExistsInJourneyData'
import QualificationLevelCreateController from './qualificationLevelCreateController'
import QualificationDetailsCreateController from './qualificationDetailsCreateController'
import HighestLevelOfEducationCreateController from './highestLevelOfEducationCreateController'
import QualificationsListCreateController from './qualificationsListCreateController'
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
 * Route definitions for creating a prisoner's qualifications before an Induction
 *
 */
export default (router: Router, services: Services) => {
  const { curiousService, educationAndWorkPlanService, journeyDataService, learnerRecordsService, prisonService } =
    services
  const highestLevelOfEducationCreateController = new HighestLevelOfEducationCreateController()
  const qualificationLevelCreateController = new QualificationLevelCreateController()
  const qualificationDetailsCreateController = new QualificationDetailsCreateController()
  const qualificationsListCreateController = new QualificationsListCreateController(educationAndWorkPlanService)

  router.use('/prisoners/:prisonNumber/create-education', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_EDUCATION),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/prisoners/:prisonNumber/create-education' - eg: '/prisoners/A1234BC/create-education/473e9ee4-37d6-4afb-92a2-5729b10cc60f/highest-level-of-education'
  ])
  router.use('/prisoners/:prisonNumber/create-education/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/prisoners/:prisonNumber/create-education/:journeyId/highest-level-of-education', [
    createEmptyEducationDtoIfNotInJourneyData,
    asyncMiddleware(highestLevelOfEducationCreateController.getHighestLevelOfEducationView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/:journeyId/highest-level-of-education', [
    validate(highestLevelOfEducationSchema),
    asyncMiddleware(highestLevelOfEducationCreateController.submitHighestLevelOfEducationForm),
  ])

  router.use('/prisoners/:prisonNumber/create-education/:journeyId/qualification-level', [
    checkEducationDtoExistsInJourneyData,
  ])
  router.get('/prisoners/:prisonNumber/create-education/:journeyId/qualification-level', [
    asyncMiddleware(qualificationLevelCreateController.getQualificationLevelView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/:journeyId/qualification-level', [
    validate(qualificationLevelSchema),
    asyncMiddleware(qualificationLevelCreateController.submitQualificationLevelForm),
  ])

  router.use('/prisoners/:prisonNumber/create-education/:journeyId/qualification-details', [
    checkEducationDtoExistsInJourneyData,
  ])
  router.get('/prisoners/:prisonNumber/create-education/:journeyId/qualification-details', [
    asyncMiddleware(qualificationDetailsCreateController.getQualificationDetailsView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/:journeyId/qualification-details', [
    validate(qualificationDetailsSchema),
    asyncMiddleware(qualificationDetailsCreateController.submitQualificationDetailsForm),
  ])

  router.get('/prisoners/:prisonNumber/create-education/:journeyId/qualifications', [
    retrievePrisonNamesById(prisonService),
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    retrieveVerifiedQualifications(learnerRecordsService),
    asyncMiddleware(qualificationsListCreateController.getQualificationsListView),
  ])
  router.post('/prisoners/:prisonNumber/create-education/:journeyId/qualifications', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Create Pre-prison Qualifications',
      redirectTo: '/plan/:prisonNumber/view/education-and-training',
    }),
    asyncMiddleware(qualificationsListCreateController.submitQualificationsListView),
  ])
}
