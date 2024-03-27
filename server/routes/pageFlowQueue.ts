import type { PageFlow } from 'viewModels'

/**
 * Module exposing utility functions that operate on [PageFlowQueue] instances. This is intended for "mini" page flows,
 * which may occur during a larger "main" flow of pages.
 */

/**
 * Returns the current page url in the specified [PageFlowQueue]
 */
const getCurrentPage = (pageFlowQueue: PageFlow): string => {
  return pageFlowQueue.pageUrls[pageFlowQueue.currentPageIndex]
}

/**
 * Returns the next page url in the specified [PageFlowQueue].
 * Does not change the current page (current page index).
 * If the current page is the last page in the queue, returns undefined.
 */
const getNextPage = (pageFlowQueue: PageFlow): string => {
  if (!isLastPage(pageFlowQueue)) {
    return pageFlowQueue.pageUrls[pageFlowQueue.currentPageIndex + 1]
  }
  return undefined
}

/**
 * Returns the previous page url in the specified [PageFlowQueue].
 * Does not change the current page (current page index).
 * If the current page is the first page in the queue, returns undefined.
 */
const getPreviousPage = (pageFlowQueue: PageFlow): string => {
  if (!isFirstPage(pageFlowQueue)) {
    return pageFlowQueue.pageUrls[pageFlowQueue.currentPageIndex - 1]
  }
  return undefined
}

const setCurrentPageIndex = (pageFlowQueue: PageFlow, currentPagePath: string): PageFlow => {
  const pageIndex = pageFlowQueue.pageUrls.findIndex(page => page === currentPagePath)
  if (pageIndex > -1) {
    return {
      ...pageFlowQueue,
      currentPageIndex: pageIndex,
    }
  }
  return pageFlowQueue
}

/**
 * Returns true if the current page in the specified [PageFlowQueue] is the first page.
 */
const isFirstPage = (pageFlowQueue: PageFlow): boolean => pageFlowQueue.currentPageIndex === 0

/**
 * Returns true if the current page in the specified [PageFlowQueue] is the last page.
 */
const isLastPage = (pageFlowQueue: PageFlow): boolean =>
  pageFlowQueue.currentPageIndex === pageFlowQueue.pageUrls.length - 1

export { setCurrentPageIndex, getCurrentPage, getNextPage, getPreviousPage, isFirstPage, isLastPage }
