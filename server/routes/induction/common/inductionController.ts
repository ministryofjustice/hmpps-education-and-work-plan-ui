import { Request } from 'express'
import { getPreviousPage, pageFlowHistoryContains, setCurrentPage } from '../../pageFlowHistory'

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

  addCurrentPageToHistory(req: Request) {
    if (!req.session.pageFlowHistory) {
      req.session.pageFlowHistory = { pageUrls: [], currentPageIndex: 0 }
    }
    const updatedPageFlowHistory = setCurrentPage(req.session.pageFlowHistory, req.path)
    req.session.pageFlowHistory = updatedPageFlowHistory
  }

  /**
   * Returns `true` if the previous page in the Page Flow History was Check Your Answers
   */
  previousPageWasCheckYourAnswers(req: Request): boolean {
    const { pageFlowHistory } = req.session
    return pageFlowHistory && getPreviousPage(pageFlowHistory).endsWith('/check-your-answers')
  }

  /**
   * Returns `true` if the Page Flow History contains Check Your Answers (anywhere in the history)
   */
  checkYourAnswersIsInThePageHistory(req: Request): boolean {
    const { pageFlowHistory } = req.session
    return pageFlowHistory && pageFlowHistoryContains(pageFlowHistory, /\/check-your-answers$/)
  }
}
