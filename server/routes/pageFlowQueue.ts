import type { PageFlowQueue } from 'viewModels'

/**
 * Module exposing utility functions that operate on [PageFlowQueue] instances
 */

/**
 * Adds the provided page url to the last position in the specified [PageFlowQueue].
 * Does not change the current page (current page index).
 */
const addPage = (pageFlowQueue: PageFlowQueue, pageUrl: string): PageFlowQueue => {
  pageFlowQueue.pageUrls.push(pageUrl)
  return {
    ...pageFlowQueue,
  }
}

/**
 * Returns the current page url in the specified [PageFlowQueue]
 */
const getCurrentPage = (pageFlowQueue: PageFlowQueue): string => {
  return pageFlowQueue.pageUrls[pageFlowQueue.currentPageIndex]
}

/**
 * Returns the next page url in the specified [PageFlowQueue].
 * Does not change the current page (current page index).
 * If the current page is the last page in the queue, returns undefined.
 */
const getNextPage = (pageFlowQueue: PageFlowQueue): string => {
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
const getPreviousPage = (pageFlowQueue: PageFlowQueue): string => {
  if (!isFirstPage(pageFlowQueue)) {
    return pageFlowQueue.pageUrls[pageFlowQueue.currentPageIndex - 1]
  }
  return undefined
}

const setCurrentPageIndex = (pageFlowQueue: PageFlowQueue, currentPagePath: string): PageFlowQueue => {
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
const isFirstPage = (pageFlowQueue: PageFlowQueue): boolean => pageFlowQueue.currentPageIndex === 0

/**
 * Returns true if the current page in the specified [PageFlowQueue] is the last page.
 */
const isLastPage = (pageFlowQueue: PageFlowQueue): boolean =>
  pageFlowQueue.currentPageIndex === pageFlowQueue.pageUrls.length - 1

export { addPage, getCurrentPage, getNextPage, getPreviousPage, setCurrentPageIndex, isFirstPage, isLastPage }
