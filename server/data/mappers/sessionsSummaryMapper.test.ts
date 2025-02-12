import type { SessionsSummary } from 'viewModels'
import type { SessionSummaryResponse } from 'educationAndWorkPlanApiClient'
import toSessionsSummary from './sessionsSummaryMapper'
import aValidSessionSummaryResponse from '../../testsupport/sessionSummaryResponseTestDataBuilder'
import aValidSessionsSummary from '../../testsupport/sessionsSummaryTestDataBuilder'

describe('sessionsSummaryMapper', () => {
  it('should map SessionSummaryResponse to SessionsSummary', () => {
    // Given
    const sessionSummaryResponse = aValidSessionSummaryResponse({
      overdueReviews: 1,
      overdueInductions: 2,
      dueReviews: 3,
      dueInductions: 4,
      exemptReviews: 5,
      exemptInductions: 6,
    })

    const expected = aValidSessionsSummary({
      overdueSessionCount: 3,
      dueSessionCount: 7,
      onHoldSessionCount: 11,
      problemRetrievingData: false,
    })

    // When
    const actual = toSessionsSummary(sessionSummaryResponse)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should not map to SessionsSummary given no SessionSummaryResponse', () => {
    // Given
    const sessionSummaryResponse: SessionSummaryResponse = undefined

    const expected = {
      problemRetrievingData: true,
    } as SessionsSummary

    // When
    const actual = toSessionsSummary(sessionSummaryResponse)

    // Then
    expect(actual).toEqual(expected)
  })
})
