import { Request } from 'express'
import { getPreviousPage, setCurrentPage } from '../../pageFlowHistory'

/**
 * Abstract controller class defining functionality common to all Induction screens and journeys.
 */
export default abstract class InductionController {
  addCurrentPageToHistory(req: Request) {
    if (!req.session.pageFlowHistory) {
      req.session.pageFlowHistory = { pageUrls: [], currentPageIndex: 0 }
    }
    const updatedPageFlowHistory = setCurrentPage(req.session.pageFlowHistory, req.path)
    req.session.pageFlowHistory = updatedPageFlowHistory
  }

  /**
   * Returns `true` if the previous page in the Page Flow History was Check Your Answers
   *
   * If there is no previous page the Page Flow History has likely not been updated with the current page yet.
   * In this case, if the current page index is 0 and there is only one page in the history, then check to see if that
   * page is Check Your Answers.
   */
  previousPageWasCheckYourAnswers(req: Request): boolean {
    const { pageFlowHistory } = req.session
    if (!pageFlowHistory) {
      return false
    }
    const previousPage = getPreviousPage(pageFlowHistory)
    if (previousPage) {
      return previousPage.endsWith('/check-your-answers')
    }

    if (pageFlowHistory.currentPageIndex === 0 && pageFlowHistory.pageUrls.length === 1) {
      return this.checkYourAnswersIsTheFirstPageInThePageHistory(req)
    }

    return false
  }

  /**
   * Returns `true` if the first page in the Page Flow History is Check Your Answers
   */
  checkYourAnswersIsTheFirstPageInThePageHistory(req: Request): boolean {
    const { pageFlowHistory } = req.session
    return pageFlowHistory && pageFlowHistory.pageUrls.at(0).match(/\/check-your-answers$/) !== null
  }

  /**
   * If the previous page was Check Your Answers the user is following a Change link from Check Your Answers.
   * Add the current page to the page flow history so that the Back link redirects correctly back to Check Your Answers.
   */
  addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req: Request) {
    if (this.previousPageWasCheckYourAnswers(req)) {
      this.addCurrentPageToHistory(req)
    }
  }
}
