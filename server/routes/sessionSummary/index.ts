import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../enums/applicationAction'
import SessionSummaryController from './sessionSummaryController'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveSessionsSummary from '../routerRequestHandlers/retrieveSessionsSummary'

const sessionSummaryRoutes = (services: Services) => {
  const { sessionService } = services
  const sessionSummaryController = new SessionSummaryController()

  return Router({ mergeParams: true }) //
    .get('/', [
      checkUserHasPermissionTo(ApplicationAction.VIEW_SESSION_SUMMARIES),
      retrieveSessionsSummary(sessionService),
      asyncMiddleware(sessionSummaryController.getSessionSummaryView),
    ])
}

export default sessionSummaryRoutes
