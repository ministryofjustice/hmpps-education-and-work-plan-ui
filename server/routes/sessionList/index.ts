import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../enums/applicationAction'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import SessionListController from './sessionListController'
import retrieveSessionsSummary from '../routerRequestHandlers/retrieveSessionsSummary'
import config from '../../config'
import sessionListSearch from '../routerRequestHandlers/sessionListSearch'
import SessionStatusValue from '../../enums/sessionStatusValue'

const sessionListRoutes = (router: Router, services: Services) => {
  const { prisonerService, sessionService } = services
  const sessionListController = new SessionListController(prisonerService, sessionService)

  router.use('/sessions', [
    checkUserHasPermissionTo(ApplicationAction.VIEW_SESSION_SUMMARIES),
    retrieveSessionsSummary(sessionService),
  ])

  router.get(
    '/sessions/due',
    config.featureToggles.newSessionApiEnabled
      ? [
          sessionListSearch(sessionService, SessionStatusValue.DUE),
          asyncMiddleware(sessionListController.getDueSessionsView),
        ]
      : [asyncMiddleware(sessionListController.getOldDueSessionsView)],
  )

  router.get(
    '/sessions/overdue',
    config.featureToggles.newSessionApiEnabled
      ? [
          sessionListSearch(sessionService, SessionStatusValue.OVERDUE),
          asyncMiddleware(sessionListController.getOverdueSessionsView),
        ]
      : [asyncMiddleware(sessionListController.getOldOverdueSessionsView)],
  )

  router.get('/sessions/on-hold', [asyncMiddleware(sessionListController.getOnHoldSessionsView)])
}

export default sessionListRoutes
