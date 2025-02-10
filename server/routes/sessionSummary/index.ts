import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../enums/applicationAction'

const sessionSummaryRoutes = (router: Router, _services: Services) => {
  router.get('/sessions', [
    checkUserHasPermissionTo(ApplicationAction.VIEW_SESSION_SUMMARIES),
    // TODO - invoke controller methpd here
  ])
}

export default sessionSummaryRoutes
