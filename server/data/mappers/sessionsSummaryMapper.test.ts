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
    })

    // When
    const actual = toSessionsSummary(sessionSummaryResponse)

    // Then
    expect(actual).toEqual(expected)
  })
})
