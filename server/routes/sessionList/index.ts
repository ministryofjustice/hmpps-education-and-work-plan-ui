import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../enums/applicationAction'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import SessionListController from './sessionListController'
import retrieveSessionsSummary from '../routerRequestHandlers/retrieveSessionsSummary'

const sessionListRoutes = (router: Router, services: Services) => {
  const { sessionService } = services
  const sessionListController = new SessionListController()

  router.use('/sessions/*', [
    checkUserHasPermissionTo(ApplicationAction.VIEW_SESSION_SUMMARIES),
    retrieveSessionsSummary(sessionService),
  ])

  router.get('/sessions/due', [asyncMiddleware(sessionListController.getDueSessionsView)])

  router.get('/sessions/overdue', [asyncMiddleware(sessionListController.getOverdueSessionsView)])

  router.get('/sessions/on-hold', [asyncMiddleware(sessionListController.getOnHoldSessionsView)])
}

export default sessionListRoutes
