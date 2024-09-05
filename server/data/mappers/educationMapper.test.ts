import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'
import toEducationDto from './educationMapper'
import aValidEducationResponse from '../../testsupport/educationResponseTestDataBuilder'

describe('educationMapper', () => {
  it('should map an EducationResponse to a EducationDto', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const educationResponse = aValidEducationResponse()
    const expectedDto = aValidEducationDto({ prisonNumber })

    // When
    const actual = toEducationDto(educationResponse, prisonNumber)

    // Then
    expect(actual).toEqual(expectedDto)
  })
})
