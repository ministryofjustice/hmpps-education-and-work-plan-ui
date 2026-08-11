import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../enums/applicationAction'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import SessionListController from './sessionListController'
import retrieveSessionsSummary from '../routerRequestHandlers/retrieveSessionsSummary'
import sessionListSearch from '../routerRequestHandlers/sessionListSearch'
import SessionStatusValue from '../../enums/sessionStatusValue'
import SessionSortBy from '../../enums/sessionSortBy'

const sessionListRoutes = (services: Services) => {
  const router = Router({ mergeParams: true })
  const { sessionService } = services
  const sessionListController = new SessionListController()

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.VIEW_SESSION_SUMMARIES),
    retrieveSessionsSummary(sessionService),
  ])

  router.get('/due', [
    sessionListSearch(sessionService, SessionStatusValue.DUE),
    asyncMiddleware(sessionListController.getDueSessionsView),
  ])

  router.get('/overdue', [
    sessionListSearch(sessionService, SessionStatusValue.OVERDUE),
    asyncMiddleware(sessionListController.getOverdueSessionsView),
  ])

  router.get('/on-hold', [
    sessionListSearch(sessionService, SessionStatusValue.ON_HOLD),
    asyncMiddleware(sessionListController.getOnHoldSessionsView),
  ])

  router.get('/screener-pending', [
    sessionListSearch(sessionService, SessionStatusValue.SCREENER_PENDING, {
      // this list has no 'due by' column, and only offers sortable headers for these 3 columns
      defaultSortField: SessionSortBy.NAME,
      allowedSortFields: [SessionSortBy.NAME, SessionSortBy.LOCATION, SessionSortBy.RELEASE_DATE],
    }),
    asyncMiddleware(sessionListController.getScreenerPendingSessionsView),
  ])

  return router
}

export default sessionListRoutes
