import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidV4, validate } from 'uuid'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Function that returns a middleware request handler function that inserts a journey ID (UUID) at a specified element
 * in the request path.
 */
export default function insertJourneyIdentifier(options: { insertIdAfterElement: number }) {
  return asyncMiddleware((req: Request, res: Response, next: NextFunction): void => {
    const urlPathElements = req.originalUrl.split('/')
    const uuid = urlPathElements[options.insertIdAfterElement + 1]

    if (!validate(uuid)) {
      const redirectUrl = urlPathElements.toSpliced(options.insertIdAfterElement + 1, 0, uuidV4()).join('/')
      return res.redirect(redirectUrl)
    }
    return next()
  })
}
