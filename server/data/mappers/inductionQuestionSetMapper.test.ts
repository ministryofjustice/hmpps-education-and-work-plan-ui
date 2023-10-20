import toInductionQuestionSet from './inductionQuestionSetMapper'
import { aCiagInductionWithOtherQualifications } from '../../testsupport/ciagInductionTestDataBuilder'

describe('inductionQuestionSetMapper', () => {
  Array.of(
    { hopingToGetWork: 'YES', expectedInductionQuestionSet: 'LONG_QUESTION_SET' },
    { hopingToGetWork: 'NO', expectedInductionQuestionSet: 'SHORT_QUESTION_SET' },
    { hopingToGetWork: 'NOT_SURE', expectedInductionQuestionSet: 'SHORT_QUESTION_SET' },
  ).forEach(fixture => {
    it(`should map to Induction Question Set given CIAG Induction where hoping to get work is ${fixture.hopingToGetWork}`, () => {
      // Given
      const ciagInduction = aCiagInductionWithOtherQualifications()
      ciagInduction.hopingToGetWork = fixture.hopingToGetWork

      // When
      const actual = toInductionQuestionSet(ciagInduction)

      // Then
      expect(actual).toEqual(fixture.expectedInductionQuestionSet)
    })
  })
})
