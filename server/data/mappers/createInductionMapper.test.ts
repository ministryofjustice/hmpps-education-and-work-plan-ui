import {
  aLongQuestionSetCreateInductionDto,
  aShortQuestionSetCreateInductionDto,
} from '../../testsupport/createInductionDtoTestDataBuilder'
import {
  aLongQuestionSetCreateInductionRequest,
  aShortQuestionSetCreateInductionRequest,
} from '../../testsupport/createInductionRequestTestDataBuilder'
import toCreateInductionRequest from './createInductionMapper'

describe('createInductionMapper', () => {
  it('should map to CreateInductionRequest given a short question set CreateOrUpdateInductionDto', () => {
    // Given
    const createInductionDto = aShortQuestionSetCreateInductionDto()
    const expected = aShortQuestionSetCreateInductionRequest()

    // When
    const actual = toCreateInductionRequest(createInductionDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to CreateInductionRequest given a long question set CreateOrUpdateInductionDto', () => {
    // Given
    const createInductionDto = aLongQuestionSetCreateInductionDto()
    const expected = aLongQuestionSetCreateInductionRequest()

    // When
    const actual = toCreateInductionRequest(createInductionDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
