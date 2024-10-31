import { Request } from 'express'
import type { PageFlow } from 'viewModels'

/**
 * Module exposing utility functions that operate on [PageFlow] instances. This is to maintain a history of pages
 * that have been visited as part of a journey (e.g. for back links on forms).
 */

/**
 * Builds and returns a new [PageFlow] instance to be used as a Page Flow History, using the current route as the
 * initial page in the history.
 */
const buildNewPageFlowHistory = (req: Request): PageFlow => {
  const pageUrls = [req.path]
  return {
    pageUrls,
    currentPageIndex: 0,
  }
}

const addCurrentPageToHistory = (req: Request) => {
  if (!req.session.pageFlowHistory) {
    req.session.pageFlowHistory = { pageUrls: [], currentPageIndex: 0 }
  }
  const updatedPageFlowHistory = setCurrentPage(req.session.pageFlowHistory, req.path)
  req.session.pageFlowHistory = updatedPageFlowHistory
}

/**
 * Either adds the provided page url to the last position in the specified [PageFlow], or if the page has been
 * added previously, it sets the current page index to its position. In either case, the current page index is updated.
 * Note that any pages after this index are removed, so that the current page is always is the last page. This is to
 * maintain a clean history of previous pages.
 */
const setCurrentPage = (pageFlowHistory: PageFlow, pageUrl: string): PageFlow => {
  const pageIndex = pageFlowHistory.pageUrls.findIndex(page => page === pageUrl)
  const pageUrls = [...pageFlowHistory.pageUrls]
  if (pageIndex < 0) {
    pageUrls.push(pageUrl)
  }
  return setCurrentPageIndex({ ...pageFlowHistory, pageUrls }, pageUrl)
}

/**
 * Returns the previous page url in the specified [PageFlow].
 * Does not change the current page (current page index).
 * If the current page is the first page in the queue, returns undefined.
 */
const getPreviousPage = (pageFlowHistory: PageFlow): string => {
  if (!isFirstPage(pageFlowHistory)) {
    return pageFlowHistory.pageUrls[pageFlowHistory.currentPageIndex - 1]
  }
  return undefined
}

/**
 * Returns true if the current page in the specified [PageFlow] is the first page.
 */
const isFirstPage = (pageFlowHistory: PageFlow): boolean => pageFlowHistory.currentPageIndex === 0

/**
 * Returns true if the current page in the specified [PageFlow] is the last page.
 */
const isLastPage = (pageFlowHistory: PageFlow): boolean =>
  pageFlowHistory.currentPageIndex === pageFlowHistory.pageUrls.length - 1

/**
 * Returns true if the provided page url in the specified [PageFlow] is the last page.
 */
const isPageInFlow = (pageFlowHistory: PageFlow, pageUrl: string): boolean => {
  return pageFlowHistory.pageUrls.findIndex(page => page === pageUrl) >= 0
}

/**
 * Sets the current page index to the position of the provided page.
 * Any pages after this index are removed, so that the current page is always is the last page. This is to maintain a
 * clean history of previous pages (i.e. for the back links).
 * Note that this is not intended to be used outside of this module.
 * @param pageFlowHistory
 * @param currentPagePath
 */
const setCurrentPageIndex = (pageFlowHistory: PageFlow, currentPagePath: string): PageFlow => {
  const pageIndex = pageFlowHistory.pageUrls.findIndex(page => page === currentPagePath)
  if (pageIndex > -1) {
    // simplify the page history by removing any pages that have previously been added after this one
    const pageUrls = [...pageFlowHistory.pageUrls]
    pageUrls.splice(pageIndex + 1)
    return {
      ...pageFlowHistory,
      pageUrls,
      currentPageIndex: pageIndex,
    }
  }
  return pageFlowHistory
}

/**
 * Return `true` if the specified page flow history contains a page URL that matches the expected page URL
 */
const pageFlowHistoryContains = (pageFlowHistory: PageFlow, expectedPageUrl: RegExp): boolean => {
  return pageFlowHistory && pageFlowHistory.pageUrls.find(pageUrl => expectedPageUrl.test(pageUrl)) != null
}

export {
  buildNewPageFlowHistory,
  setCurrentPage,
  getPreviousPage,
  isFirstPage,
  isLastPage,
  isPageInFlow,
  pageFlowHistoryContains,
  addCurrentPageToHistory,
}
