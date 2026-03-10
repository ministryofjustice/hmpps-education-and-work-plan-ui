import aValidUpdateInductionDto from '../../testsupport/updateInductionDtoTestDataBuilder'
import aValidUpdateInductionRequest from '../../testsupport/updateInductionRequestTestDataBuilder'
import toUpdateInductionRequest from './updateInductionMapper'

describe('updateInductionMapper', () => {
  it('should map a CreateOrUpdateInductionDto to an UpdateInductionRequest', () => {
    // Given
    const updateInductionDto = aValidUpdateInductionDto({
      employabilitySkills: null,
    })
    const expected = aValidUpdateInductionRequest()

    // When
    const actual = toUpdateInductionRequest(updateInductionDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
