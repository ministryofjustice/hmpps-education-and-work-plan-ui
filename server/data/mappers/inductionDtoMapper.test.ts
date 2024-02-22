import {
  aLongQuestionSetInduction,
  aShortQuestionSetInduction,
} from '../../testsupport/inductionResponseTestDataBuilder'
import {
  aLongQuestionSetInductionDto,
  aShortQuestionSetInductionDto,
} from '../../testsupport/inductionDtoTestDataBuilder'
import toInductionDto from './inductionDtoMapper'

describe('inductionDtoMapper', () => {
  it('should map to InductionDto given a short question set InductionResponse', () => {
    // Given
    const shortQuestionSetInductionResponse = aShortQuestionSetInduction()
    const expected = aShortQuestionSetInductionDto()

    // When
    const actual = toInductionDto(shortQuestionSetInductionResponse)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to InductionDto given a long question set InductionResponse', () => {
    // Given
    const longQuestionSetInductionResponse = aLongQuestionSetInduction()
    const expected = aLongQuestionSetInductionDto()

    // When
    const actual = toInductionDto(longQuestionSetInductionResponse)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should not map to InductionDto given undefined InductionResponse', () => {
    // Given

    // When
    const actual = toInductionDto(undefined)

    // Then
    expect(actual).toBeUndefined()
  })
})
