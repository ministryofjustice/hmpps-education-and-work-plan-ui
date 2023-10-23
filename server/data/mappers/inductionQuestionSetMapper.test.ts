import toInductionQuestionSet from './inductionQuestionSetMapper'
import {
  aLongQuestionSetCiagInduction,
  aShortQuestionSetCiagInduction,
} from '../../testsupport/ciagInductionTestDataBuilder'

describe('inductionQuestionSetMapper', () => {
  it('should map to Induction Question Set given long question set CIAG Induction', () => {
    // Given
    const ciagInduction = aLongQuestionSetCiagInduction()

    // When
    const actual = toInductionQuestionSet(ciagInduction)

    // Then
    expect(actual).toEqual('LONG_QUESTION_SET')
  })

  Array.of('NO', 'NOT_SURE').forEach(hopingToGetWork => {
    it(`should map to Induction Question Set given short question set CIAG Induction where hoping to get work is ${hopingToGetWork}`, () => {
      // Given
      const ciagInduction = aShortQuestionSetCiagInduction()
      ciagInduction.hopingToGetWork = hopingToGetWork

      // When
      const actual = toInductionQuestionSet(ciagInduction)

      // Then
      expect(actual).toEqual('SHORT_QUESTION_SET')
    })
  })
})
