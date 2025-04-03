import { NextFunction, Request, Response } from 'express'
import { setCurrentPageIndex } from '../pageFlowQueue'

/**
 * Request handler function that sets the current page in the [PageFlowQueue] if this page request is part of a page
 * flow (designated by the presence of a [PageFlowQueue] on the session)
 */
const setCurrentPageInPageFlowQueue = async (req: Request, res: Response, next: NextFunction) => {
  const { pageFlowQueue } = req.session
  if (pageFlowQueue) {
    req.session.pageFlowQueue = setCurrentPageIndex(pageFlowQueue, req.originalUrl)
  }
  next()
}
export default setCurrentPageInPageFlowQueue
