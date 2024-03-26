import { Request } from 'express'
import { addPage } from '../../pageFlowQueue'

/**
 * Abstract controller class defining functionality common to all Induction screens and journeys.
 */
export default abstract class InductionController {
  /**
   * Concrete classes must provide an implementation of this method to provide the backlink URL relevant to their use case / journey.
   */
  abstract getBackLinkUrl(req: Request): string

  /**
   * Concrete classes must provide an implementation of this method to provide the backlink aria text relevant to their use case / journey.
   */
  abstract getBackLinkAriaText(req: Request): string

  addCurrentPageToQueue(req: Request, currentPageUri: string) {
    const { pageFlowQueue } = req.session
    const updatedPageFlowQueue = addPage(pageFlowQueue, currentPageUri)
    req.session.pageFlowQueue = updatedPageFlowQueue
  }
}
