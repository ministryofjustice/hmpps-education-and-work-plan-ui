import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'
import { Services } from './services'
import { Page, PageViewEventDetails } from './services/auditService'

export default function createErrorHandler({ auditService }: Services, production: boolean) {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)

    if (error.status === 401 || error.status === 403) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    res.locals.message = production
      ? 'Something went wrong. The error has been logged. Please try again'
      : error.message
    res.locals.status = error.status
    res.locals.stack = production ? null : error.stack

    res.status(error.status || 500)

    const auditDetails: PageViewEventDetails = {
      who: req.user.username ?? 'UNKNOWN',
      correlationId: req.id,
      details: {
        params: req.params,
        query: req.query,
      },
    }

    if (res.statusCode === 404) {
      auditService.logPageView(Page.NOT_FOUND, auditDetails)
      return res.render('pages/404')
    }

    auditService.logPageView(Page.ERROR, auditDetails)
    return res.render('pages/error')
  }
}
