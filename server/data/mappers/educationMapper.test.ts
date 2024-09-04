import aValidEducationResponse from '../../testsupport/educationResponseTestDataBuilder'
import toEducationResponse from './educationMapper'

describe('educationMapper', () => {
  it('should map an educationDto to an EducationRequest', () => {
    // Given
    const expected = aValidEducationResponse()

    // When
    const actual = toEducationResponse(expected)

    // Then
    expect(actual).toEqual(expected)
  })
})
