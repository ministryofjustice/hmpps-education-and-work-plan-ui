import type { PageFlow } from 'viewModels'
import { setCurrentPage, getPreviousPage, isFirstPage, isLastPage, isPageInFlow } from './pageFlowHistory'

describe('pageFlowHistory', () => {
  const PAGE_FLOW_HISTORY: PageFlow = {
    pageUrls: ['/first-page', '/second-page', '/third-page'],
    currentPageIndex: 2,
  }

  describe('getPreviousPage', () => {
    it('should get previous page given pageFlowHistory is not on the first page', () => {
      // Given
      const pageFlowHistory = PAGE_FLOW_HISTORY

      // When
      const actual = getPreviousPage(pageFlowHistory)

      // Then
      expect(actual).toEqual('/second-page')
    })

    it('should not get previous page given pageFlowHistory is on the first page', () => {
      // Given
      const pageFlowHistory: PageFlow = {
        pageUrls: ['/first-page'],
        currentPageIndex: 0,
      }

      // When
      const actual = getPreviousPage(pageFlowHistory)

      // Then
      expect(actual).toBeUndefined()
    })
  })

  describe('isFirstPage', () => {
    it('should determine if isFirstPage given the pageFlowHistory is on the first page', () => {
      // Given
      const pageFlowHistory: PageFlow = {
        pageUrls: ['/first-page'],
        currentPageIndex: 0,
      }

      // When
      const actual = isFirstPage(pageFlowHistory)

      // Then
      expect(actual).toBeTruthy()
    })

    it('should determine if isFirstPage given the pageFlowHistory is not on the first page', () => {
      // Given
      const pageFlowHistory = PAGE_FLOW_HISTORY

      // When
      const actual = isFirstPage(pageFlowHistory)

      // Then
      expect(actual).toBeFalsy()
    })
  })

  describe('isLastPage', () => {
    it('should determine if isLastPage given the pageFlowHistory is on the last page', () => {
      // Given
      const pageFlowHistory = PAGE_FLOW_HISTORY

      // When
      const actual = isLastPage(pageFlowHistory)

      // Then
      expect(actual).toBeTruthy()
    })
  })

  describe('isPageInFlow', () => {
    it('should determine if isPageInFlow given the page is in the pageFlowHistory', () => {
      // Given
      const pageFlowHistory = PAGE_FLOW_HISTORY

      // When
      const actual = isPageInFlow(pageFlowHistory, '/third-page')

      // Then
      expect(actual).toBeTruthy()
    })

    it('should determine if isPageInFlow given the page is not in the pageFlowHistory', () => {
      // Given
      const pageFlowHistory = PAGE_FLOW_HISTORY

      // When
      const actual = isPageInFlow(pageFlowHistory, '/random-page')

      // Then
      expect(actual).toBeFalsy()
    })
  })

  describe('addCurrentPage', () => {
    it('should add page and increment page index', () => {
      // Given
      const pageFlowHistory = PAGE_FLOW_HISTORY
      const expected: PageFlow = {
        pageUrls: ['/first-page', '/second-page', '/third-page', '/fourth-page'],
        currentPageIndex: 3,
      }

      // When
      const actual = setCurrentPage(pageFlowHistory, '/fourth-page')

      // Then
      expect(actual).toEqual(expected)
    })

    it('should not add page and remove pages after it given it already exists in the pageFlowHistory', () => {
      // Given
      const pageFlowHistory = PAGE_FLOW_HISTORY
      const expected: PageFlow = {
        pageUrls: ['/first-page', '/second-page'],
        currentPageIndex: 1,
      }

      // When
      const actual = setCurrentPage(pageFlowHistory, '/second-page')

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
