import toCreateOrUpdateInductionDto from './createOrUpdateInductionDtoMapper'
import {
  aLongQuestionSetInductionDto,
  aShortQuestionSetInductionDto,
} from '../../testsupport/inductionDtoTestDataBuilder'
import {
  aLongQuestionSetUpdateInductionDto,
  aShortQuestionSetUpdateInductionDto,
} from '../../testsupport/updateInductionDtoTestDataBuilder'

describe('createOrUpdateInductionDtoMapper', () => {
  it('should map to CreateOrUpdateInductionDto given a short question set InductionDto', () => {
    // Given
    const prisonId = 'MDI'
    const inductionDto = aShortQuestionSetInductionDto()
    const expected = aShortQuestionSetUpdateInductionDto()

    // When
    const actual = toCreateOrUpdateInductionDto(prisonId, inductionDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to CreateOrUpdateInductionDto given a long question set InductionDto', () => {
    // Given
    const prisonId = 'MDI'
    const inductionDto = aLongQuestionSetInductionDto()
    const expected = aLongQuestionSetUpdateInductionDto()

    // When
    const actual = toCreateOrUpdateInductionDto(prisonId, inductionDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
