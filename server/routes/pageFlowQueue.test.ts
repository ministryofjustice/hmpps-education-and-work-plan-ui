import type { PageFlowQueue } from 'viewModels'
import { addPage, getCurrentPage, getNextPage, getPreviousPage, isFirstPage, isLastPage } from './pageFlowQueue'

describe('pageFlowQueue', () => {
  const PAGE_FLOW_QUEUE: PageFlowQueue = {
    pageUrls: ['/first-page', '/second-page', '/third-page'],
    currentPageIndex: 2,
  }

  describe('getCurrentPage', () => {
    it('should get current page', () => {
      // Given
      const pageFlowQueue = PAGE_FLOW_QUEUE

      // When
      const actual = getCurrentPage(pageFlowQueue)

      // Then
      expect(actual).toEqual('/third-page')
    })
  })

  describe('getNextPage', () => {
    it('should not get next page given pageFlowQueue is on the last page', () => {
      // Given
      const pageFlowQueue = PAGE_FLOW_QUEUE

      // When
      const actual = getNextPage(pageFlowQueue)

      // Then
      expect(actual).toBeUndefined()
    })
  })

  describe('getPreviousPage', () => {
    it('should get previous page given pageFlowQueue is not on the first page', () => {
      // Given
      const pageFlowQueue = PAGE_FLOW_QUEUE

      // When
      const actual = getPreviousPage(pageFlowQueue)

      // Then
      expect(actual).toEqual('/second-page')
    })

    it('should not get previous page given pageFlowQueue is on the first page', () => {
      // Given
      const pageFlowQueue: PageFlowQueue = {
        pageUrls: ['/first-page'],
        currentPageIndex: 0,
      }

      // When
      const actual = getPreviousPage(pageFlowQueue)

      // Then
      expect(actual).toBeUndefined()
    })
  })

  describe('isFirstPage', () => {
    it('should determine if isFirstPage given the pageFlowQueue is on the first page', () => {
      // Given
      const pageFlowQueue: PageFlowQueue = {
        pageUrls: ['/first-page'],
        currentPageIndex: 0,
      }

      // When
      const actual = isFirstPage(pageFlowQueue)

      // Then
      expect(actual).toBeTruthy()
    })

    it('should determine if isFirstPage given the pageFlowQueue is not on the first page', () => {
      // Given
      const pageFlowQueue = PAGE_FLOW_QUEUE

      // When
      const actual = isFirstPage(pageFlowQueue)

      // Then
      expect(actual).toBeFalsy()
    })
  })

  describe('isLastPage', () => {
    it('should determine if isLastPage given the pageFlowQueue is on the last page', () => {
      // Given
      const pageFlowQueue = PAGE_FLOW_QUEUE

      // When
      const actual = isLastPage(pageFlowQueue)

      // Then
      expect(actual).toBeTruthy()
    })
  })

  describe('addPage', () => {
    it('should add page and increment page index', () => {
      // Given
      const pageFlowQueue = PAGE_FLOW_QUEUE
      const expected: PageFlowQueue = {
        pageUrls: ['/first-page', '/second-page', '/third-page', '/fourth-page'],
        currentPageIndex: 3,
      }

      // When
      const actual = addPage(pageFlowQueue, '/fourth-page')

      // Then
      expect(actual).toEqual(expected)
    })

    it('should not add page and remove pages after it given it already exists in the pageFlowQueue', () => {
      // Given
      const pageFlowQueue = PAGE_FLOW_QUEUE
      const expected: PageFlowQueue = {
        pageUrls: ['/first-page', '/second-page'],
        currentPageIndex: 1,
      }

      // When
      const actual = addPage(pageFlowQueue, '/second-page')

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
