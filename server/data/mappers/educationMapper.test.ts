import aValidEducationDto from '../../testsupport/aValidEducationDtoTestDataBuilder'
import toEducationResponse from './educationMapper'

describe('educationMapper', () => {
  it('should map an EducationResponse to a EducationDto', () => {
    // Given
    const expected = aValidEducationDto()

    // When
    const actual = toEducationResponse(expected)

    // Then
    expect(actual).toEqual(expected)
  })
})
