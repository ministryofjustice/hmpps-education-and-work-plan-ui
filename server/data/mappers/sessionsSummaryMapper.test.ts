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
      screenerPendingInductions: 7,
    })

    const expected = aValidSessionsSummary({
      overdueSessionCount: 3,
      dueSessionCount: 7,
      onHoldSessionCount: 11,
      screenerPendingCount: 7,
    })

    // When
    const actual = toSessionsSummary(sessionSummaryResponse)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map screenerPendingInductions to zero given the API response does not contain the field', () => {
    // Given
    // an API deployed before the screener pending change omits the field altogether
    const sessionSummaryResponse = aValidSessionSummaryResponse()
    delete sessionSummaryResponse.screenerPendingInductions

    // When
    const actual = toSessionsSummary(sessionSummaryResponse)

    // Then
    expect(actual.screenerPendingCount).toEqual(0)
  })
})
