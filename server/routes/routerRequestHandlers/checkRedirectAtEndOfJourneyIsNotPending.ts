import { NextFunction, Request, RequestHandler, Response } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import logger from '../../../logger'

const FLASH_KEY = 'pendingRedirectAtEndOfJourney'

/**
 * Function that returns a middleware request handler function that checks if the flag on the flash scope that indicates a pending
 * redirect is set. If the flag is set the route is redirected, else the route handler chain continues.
 *
 * This is to address a specific problem (_possibly_ with nginx/Cloud Platform) where GET requests (including redirects) have their
 * connection terminated for some reason (nginx logs these as HTTP 499, App Insights logs them as HTTP 0). When this happens
 * no response data is sent to the browser, resulting in an empty/blank screen. In these cases the user typically presses
 * Control-R/Control-F5 to refresh.
 * When this happens as part of a 'POST Redirect GET' pattern (ie. a POST request handler) the POST handler will already
 * have been processed (eg: calling an API to commit data). The redirect is issued, but the GET fails with a HTTP 499/0
 * When the user refreshes the browser, the POST is re-requested, not the GET! This means the POST handler runs again. Problems
 * arise if the POST handler is expecting data on the session etc and/or calls an API.
 */
const checkRedirectAtEndOfJourneyIsNotPending = (config: { journey: string; redirectTo: string }): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    if (req.flash(FLASH_KEY)?.at(0) === 'true') {
      const resolvedRedirectPath = config.redirectTo.matchAll(/\/:([^/]+)/g).reduce((current, match) => {
        const paramName = match[1]
        return current.replace(`:${paramName}`, req.params[paramName] ?? `:${paramName}`)
      }, config.redirectTo)

      logger.warn(
        `Possible resubmission of form following HTTP 0 (${config.journey}). Redirecting to ${resolvedRedirectPath}`,
      )
      return res.redirect(resolvedRedirectPath)
    }
    return next()
  })
}

/**
 * Function that sets the "redirect pending" flag on the request flash scope.
 */
const setRedirectPendingFlag = (req: Request) => req.flash(FLASH_KEY, 'true')

export { setRedirectPendingFlag, checkRedirectAtEndOfJourneyIsNotPending }
