import toInductionQuestionSet from './inductionQuestionSetMapper'
import {
  aLongQuestionSetInduction,
  aShortQuestionSetInduction,
} from '../../testsupport/inductionResponseTestDataBuilder'

describe('inductionQuestionSetMapper', () => {
  it('should map to Induction Question Set given a long question set Induction', () => {
    // Given
    const induction = aLongQuestionSetInduction()

    // When
    const actual = toInductionQuestionSet(induction)

    // Then
    expect(actual).toEqual('LONG_QUESTION_SET')
  })

  Array.of('NO', 'NOT_SURE').forEach(hopingToGetWork => {
    it(`should map to Induction Question Set given a short question set Induction where hoping to work is ${hopingToGetWork}`, () => {
      // Given
      const induction = aShortQuestionSetInduction()
      induction.workOnRelease.hopingToWork = hopingToGetWork

      // When
      const actual = toInductionQuestionSet(induction)

      // Then
      expect(actual).toEqual('SHORT_QUESTION_SET')
    })
  })
})
