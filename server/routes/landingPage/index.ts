import { Router } from 'express'
import ApplicationAction from '../../enums/applicationAction'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import config from '../../config'

const landingPageRoutes = (router: Router) => {
  // The user's landing page (ie: what they see for page route "/") is dependent on the user's permissions.
  // If they have permission to view session summaries, then they get the Session Summaries page as their landing page
  // Else they get the Prisoner Search page (what was previously known as Prisoner List)
  //
  // The approach adopted here is similar to request.forward() as found in Java's servlet spec.
  // It is NOT a client side redirect - the response is NOT a 30x redirect for the client to follow, and the client's
  // URL address bar does not change. It is more like a dynamic URL rewrite.
  // Basically the handler for "/" changes the request URL and then calls the next route handler.
  router.get(
    '/',
    asyncMiddleware(async (req, res, next) => {
      req.url =
        config.featureToggles.reviewsEnabled && res.locals.userHasPermissionTo(ApplicationAction.VIEW_SESSION_SUMMARIES)
          ? '/sessions'
          : '/search'
      next('route')
    }),
  )
}

export default landingPageRoutes
