import type { PageFlow } from 'viewModels'
import {
  appendPagesFromCurrentPage,
  getCurrentPage,
  getNextPage,
  getPreviousPage,
  isFirstPage,
  isLastPage,
  setCurrentPageIndex,
} from './pageFlowQueue'

describe('pageFlowQueue', () => {
  const PAGE_FLOW_QUEUE: PageFlow = {
    pageUrls: ['/first-page', '/second-page', '/third-page'],
    currentPageIndex: 0,
  }

  describe('getCurrentPage', () => {
    it('should get current page', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/second-page')

      // When
      const actual = getCurrentPage(pageFlowQueue)

      // Then
      expect(actual).toEqual('/second-page')
    })
  })

  describe('getNextPage', () => {
    it('should get next page given pageFlowQueue is not on the last page', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/second-page')

      // When
      const actual = getNextPage(pageFlowQueue)

      // Then
      expect(actual).toEqual('/third-page')
    })

    it('should not get next page given pageFlowQueue is on the last page', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/third-page')

      // When
      const actual = getNextPage(pageFlowQueue)

      // Then
      expect(actual).toBeUndefined()
    })
  })

  describe('getPreviousPage', () => {
    it('should get previous page given pageFlowQueue is not on the first page', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/second-page')

      // When
      const actual = getPreviousPage(pageFlowQueue)

      // Then
      expect(actual).toEqual('/first-page')
    })

    it('should not get previous page given pageFlowQueue is on the first page', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/first-page')

      // When
      const actual = getPreviousPage(pageFlowQueue)

      // Then
      expect(actual).toBeUndefined()
    })
  })

  describe('setCurrentPageIndex', () => {
    it('should set current page index given a valid page in the pageFlowQueue', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/first-page')
      const targetPage = '/second-page'

      // When
      const actual = setCurrentPageIndex(pageFlowQueue, targetPage)

      // Then
      expect(actual.currentPageIndex).toEqual(1) // zero based index
    })

    it('should not set current page index given an invalid page in the pageFlowQueue', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/first-page')
      const targetPage = '/a-page-not-in-the-page-flow-queue'

      // When
      const actual = setCurrentPageIndex(pageFlowQueue, targetPage)

      // Then
      expect(actual.currentPageIndex).toEqual(0) // zero based index
    })
  })

  describe('isFirstPage', () => {
    it('should determine if isFirstPage given the pageFlowQueue is on the first page', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/first-page')

      // When
      const actual = isFirstPage(pageFlowQueue)

      // Then
      expect(actual).toBeTruthy()
    })

    it('should determine if isFirstPage given the pageFlowQueue is not on the first page', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/second-page')

      // When
      const actual = isFirstPage(pageFlowQueue)

      // Then
      expect(actual).toBeFalsy()
    })
  })

  describe('isLastPage', () => {
    it('should determine if isLastPage given the pageFlowQueue is on the last page', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/third-page')

      // When
      const actual = isLastPage(pageFlowQueue)

      // Then
      expect(actual).toBeTruthy()
    })

    it('should determine if isLastPage given the pageFlowQueue is not on the last page', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/second-page')

      // When
      const actual = isLastPage(pageFlowQueue)

      // Then
      expect(actual).toBeFalsy()
    })
  })

  describe('appendPagesFromCurrentPage', () => {
    it('should add additional pages to the flow after the current page', () => {
      // Given
      const pageFlowQueue = pageFlowQueueOnPageUrl('/second-page')

      // When
      const actual = appendPagesFromCurrentPage(pageFlowQueue, ['/second-page-part-2', '/second-page-part-3'])

      // Then
      expect(actual.pageUrls).toEqual([
        '/first-page',
        '/second-page',
        '/second-page-part-2',
        '/second-page-part-3',
        '/third-page',
      ])
      expect(getNextPage(actual)).toEqual('/second-page-part-2')
    })
  })

  const pageFlowQueueOnPageUrl = (pageUrl: string): PageFlow => {
    return setCurrentPageIndex(PAGE_FLOW_QUEUE, pageUrl)
  }
})
