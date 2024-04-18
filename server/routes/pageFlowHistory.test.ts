import { Request } from 'express'
import type { PageFlow } from 'viewModels'
import {
  buildNewPageFlowHistory,
  setCurrentPage,
  getPreviousPage,
  isFirstPage,
  isLastPage,
  isPageInFlow,
  pageFlowHistoryContains,
} from './pageFlowHistory'

describe('pageFlowHistory', () => {
  const PAGE_FLOW_HISTORY: PageFlow = {
    pageUrls: ['/first-page', '/second-page', '/third-page'],
    currentPageIndex: 2,
  }

  describe('buildNewPageFlowHistory', () => {
    it('should builds new page flow history', () => {
      // Given
      const req = { path: '/prisoners/A1234BC/induction/check-your-answers' } as Request

      const expected: PageFlow = {
        pageUrls: ['/prisoners/A1234BC/induction/check-your-answers'],
        currentPageIndex: 0,
      }
      // When

      const actual = buildNewPageFlowHistory(req)

      // Then
      expect(actual).toEqual(expected)
    })
  })
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

  describe('pageFlowHistoryContains', () => {
    const pageFlowHistory: PageFlow = {
      pageUrls: ['/prisoners/A1234BC/induction/check-your-answers', '/prisoners/A1234BC/induction/qualifications'],
      currentPageIndex: 1,
    }

    Array.of<RegExp>(
      / /,
      /checkYourAnswers/,
      /check-Your-Answers/,
      /check-your-answers\//,
      /\/checkYourAnswers/,
      /\/check-Your-Answers/,
      /\/check-your-answers\//,
      /Qualifications/,
    ).forEach(expected => {
      it(`should return false given ${expected}`, () => {
        // Given

        // When
        const actual = pageFlowHistoryContains(pageFlowHistory, expected)

        // Then
        expect(actual).toEqual(false)
      })
    })

    Array.of<RegExp>(
      /check-your-answers/,
      /\/check-your-answers/,
      /^\/prisoners\/.*\/induction\/check.*$/,
      /qualifications/,
    ).forEach(expected => {
      it(`should return true given ${expected}`, () => {
        // Given

        // When
        const actual = pageFlowHistoryContains(pageFlowHistory, expected)

        // Then
        expect(actual).toEqual(true)
      })
    })
  })
})
