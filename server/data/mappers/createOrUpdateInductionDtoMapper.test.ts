import toCreateOrUpdateInductionDto from './createOrUpdateInductionDtoMapper'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import aValidUpdateInductionDto from '../../testsupport/updateInductionDtoTestDataBuilder'

describe('createOrUpdateInductionDtoMapper', () => {
  it('should map an InductionDto to a CreateOrUpdateInductionDto', () => {
    // Given
    const prisonId = 'MDI'
    const inductionDto = aValidInductionDto()
    const expected = aValidUpdateInductionDto()

    // When
    const actual = toCreateOrUpdateInductionDto(prisonId, inductionDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
