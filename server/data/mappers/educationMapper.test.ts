import aValidEducationResponse from '../../testsupport/educationResponseTestDataBuilder'
import toCreateEducationRequest from './educationMapper'

describe('educationMapper', () => {
  it('should map an educationDto to an EducationRequest', () => {
    // Given
    const expected = aValidEducationResponse()

    // When
    const actual = toCreateEducationRequest(expected)

    // Then
    expect(actual).toEqual(expected)
  })
})
