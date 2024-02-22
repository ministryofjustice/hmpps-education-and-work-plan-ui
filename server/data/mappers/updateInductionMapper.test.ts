import {
  aLongQuestionSetUpdateInductionDto,
  aShortQuestionSetUpdateInductionDto,
} from '../../testsupport/updateInductionDtoTestDataBuilder'
import {
  aLongQuestionSetUpdateInductionRequest,
  aShortQuestionSetUpdateInductionRequest,
} from '../../testsupport/updateInductionRequestTestDataBuilder'
import toUpdateInductionRequest from './updateInductionMapper'

describe('updateInductionMapper', () => {
  it('should map to UpdateInductionRequest given a short question set CreateOrUpdateInductionDto', () => {
    // Given
    const updateInductionDto = aShortQuestionSetUpdateInductionDto()
    const expected = aShortQuestionSetUpdateInductionRequest()

    // When
    const actual = toUpdateInductionRequest(updateInductionDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to UpdateInductionRequest given a long question set CreateOrUpdateInductionDto', () => {
    // Given
    const updateInductionDto = aLongQuestionSetUpdateInductionDto()
    const expected = aLongQuestionSetUpdateInductionRequest()

    // When
    const actual = toUpdateInductionRequest(updateInductionDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
