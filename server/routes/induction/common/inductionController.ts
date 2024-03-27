import { Request } from 'express'
import { setCurrentPage } from '../../pageFlowHistory'

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

  addCurrentPageToHistory(req: Request, currentPageUri: string) {
    if (!req.session.pageFlowHistory) {
      req.session.pageFlowHistory = { pageUrls: [], currentPageIndex: 0 }
    }
    const updatedPageFlowHistory = setCurrentPage(req.session.pageFlowHistory, currentPageUri)
    req.session.pageFlowHistory = updatedPageFlowHistory
  }
}
