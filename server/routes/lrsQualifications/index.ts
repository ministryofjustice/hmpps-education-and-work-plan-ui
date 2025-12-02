import { Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveVerifiedQualifications from '../routerRequestHandlers/retrieveVerifiedQualifications'
import LrsQualificationsController from './lrsQualificationsController'

/**
 * Route definitions for the pages relating to LRS Qualifications
 */
const lrsQualificationsRoutes = (services: Services): Router => {
  const { learnerRecordsService } = services
  const lrsQualificationsController = new LrsQualificationsController()

  return Router({ mergeParams: true }) //
    .get('/lrs-qualifications', [
      retrieveVerifiedQualifications(learnerRecordsService),
      asyncMiddleware(lrsQualificationsController.getLrsQualificationsView),
    ])
}

export default lrsQualificationsRoutes
