import aValidInductionResponse from '../../testsupport/inductionResponseTestDataBuilder'
import { anInductionDtoForAnInductionThatAlreadyExists } from '../../testsupport/inductionDtoTestDataBuilder'
import toInductionDto from './inductionDtoMapper'

describe('inductionDtoMapper', () => {
  it('should map an InductionResponse to a InductionDto', () => {
    // Given
    const inductionResponse = aValidInductionResponse()
    const expected = anInductionDtoForAnInductionThatAlreadyExists()

    // When
    const actual = toInductionDto(inductionResponse)

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
