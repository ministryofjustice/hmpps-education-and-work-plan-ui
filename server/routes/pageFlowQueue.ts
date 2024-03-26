import type { PageFlowQueue } from 'viewModels'

/**
 * Module exposing utility functions that operate on [PageFlowQueue] instances
 */

/**
 * Adds the provided page url to the last position in the specified [PageFlowQueue].
 * Does not change the current page (current page index).
 */
const addPage = (pageFlowQueue: PageFlowQueue, pageUrl: string): PageFlowQueue => {
  const pageIndex = pageFlowQueue.pageUrls.findIndex(page => page === pageUrl)
  if (pageIndex < 0) {
    pageFlowQueue.pageUrls.push(pageUrl)
  }
  return setCurrentPageIndex(pageFlowQueue, pageUrl)
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

/**
 * Returns true if the current page in the specified [PageFlowQueue] is the first page.
 */
const isFirstPage = (pageFlowQueue: PageFlowQueue): boolean => pageFlowQueue.currentPageIndex === 0

/**
 * Returns true if the current page in the specified [PageFlowQueue] is the last page.
 */
const isLastPage = (pageFlowQueue: PageFlowQueue): boolean =>
  pageFlowQueue.currentPageIndex === pageFlowQueue.pageUrls.length - 1

/**
 * Sets the current page index to the position of the provided page.
 * Any pages after this index are removed, so that the current page is always is the last page. This is to maintain a
 * clean history of previous pages (i.e. for the back links).
 * Note that this is not intended to be used outside of this module.
 * @param pageFlowQueue
 * @param currentPagePath
 */
const setCurrentPageIndex = (pageFlowQueue: PageFlowQueue, currentPagePath: string): PageFlowQueue => {
  const pageIndex = pageFlowQueue.pageUrls.findIndex(page => page === currentPagePath)
  if (pageIndex > -1) {
    // simplify the page history by removing any pages that have previously been added after this one
    pageFlowQueue.pageUrls.splice(pageIndex + 1)
    return {
      ...pageFlowQueue,
      currentPageIndex: pageIndex,
    }
  }
  return pageFlowQueue
}

export { addPage, getCurrentPage, getNextPage, getPreviousPage, isFirstPage, isLastPage }
