import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../enums/applicationAction'
import SessionSummaryController from './sessionSummaryController'
import asyncMiddleware from '../../middleware/asyncMiddleware'

const sessionSummaryRoutes = (router: Router, _services: Services) => {
  const sessionSummaryController = new SessionSummaryController()

  router.get('/sessions', [
    checkUserHasPermissionTo(ApplicationAction.VIEW_SESSION_SUMMARIES),
    asyncMiddleware(sessionSummaryController.getSessionSummaryView),
  ])
}

export default sessionSummaryRoutes
