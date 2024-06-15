import aValidCreateOrUpdateInductionDto from '../../testsupport/createInductionDtoTestDataBuilder'
import aValidCreateInductionRequest from '../../testsupport/createInductionRequestTestDataBuilder'
import toCreateInductionRequest from './createInductionMapper'

describe('createInductionMapper', () => {
  it('should map a CreateOrUpdateInductionDto to a CreateInductionRequest', () => {
    // Given
    const createInductionDto = aValidCreateOrUpdateInductionDto()
    const expected = aValidCreateInductionRequest()

    // When
    const actual = toCreateInductionRequest(createInductionDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
