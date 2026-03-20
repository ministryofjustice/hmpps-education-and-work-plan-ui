import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../enums/applicationAction'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import SessionListController from './sessionListController'
import retrieveSessionsSummary from '../routerRequestHandlers/retrieveSessionsSummary'
import sessionListSearch from '../routerRequestHandlers/sessionListSearch'
import SessionStatusValue from '../../enums/sessionStatusValue'

const sessionListRoutes = (router: Router, services: Services) => {
  const { sessionService } = services
  const sessionListController = new SessionListController()

  router.use('/sessions', [
    checkUserHasPermissionTo(ApplicationAction.VIEW_SESSION_SUMMARIES),
    retrieveSessionsSummary(sessionService),
  ])

  router.get('/sessions/due', [
    sessionListSearch(sessionService, SessionStatusValue.DUE),
    asyncMiddleware(sessionListController.getDueSessionsView),
  ])

  router.get('/sessions/overdue', [
    sessionListSearch(sessionService, SessionStatusValue.OVERDUE),
    asyncMiddleware(sessionListController.getOverdueSessionsView),
  ])

  router.get('/sessions/on-hold', [
    sessionListSearch(sessionService, SessionStatusValue.ON_HOLD),
    asyncMiddleware(sessionListController.getOnHoldSessionsView),
  ])
}

export default sessionListRoutes
