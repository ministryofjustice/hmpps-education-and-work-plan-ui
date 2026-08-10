import { NextFunction, Request, RequestHandler, Response } from 'express'

/**
 * Middleware function that executes the supplied middleware function if the request method is GET
 */
export function forAllGetRequests(middleware: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
      return middleware(req, res, next)
    }
    return next()
  }
}

/**
 * Middleware function that executes the supplied middleware function if the request method is GET and one of the supplied routes
 * matches the request path.
 */
export function forMatchingGetRequests(middleware: RequestHandler, routes: Array<string> = []): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    /*
     The route is considered a match if either no routes were supplied to the function (therefore functionally equivalent to forAllGetRequests),
     or if any of the supplied routes match the request path.
     The route matching is done by converting each route into a RegExp, replacing any route parameter placeholders with a wildcard, and testing the request path against each RegExp.
     This is because the route is not available on the request object, only the path is, and the route may contain parameters that are not present in the path.
     For example, the route /profile/:prisonNumber/overview would match the path /profile/A1234BC/overview.
     */
    const routeMatches =
      routes.length === 0
        ? true
        : routes
            // for each route, map it into a RegExp, replacing any route parameter placeholders with a wildcard - eg: /profile/:prisonNumber/overview becomes /profile/(.*)/overview
            .map(route => new RegExp(`^${route.replace(/:[^/]+/g, '(.*)')}$`))
            // return true if any of the regexes matches the request path
            .some(route => route.test(req.path))

    if (req.method === 'GET' && routeMatches) {
      return middleware(req, res, next)
    }
    return next()
  }
}
