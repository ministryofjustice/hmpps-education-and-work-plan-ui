import type { CiagInduction } from 'ciagInductionApiClient'
import type { OtherQualifications } from 'viewModels'
import toOtherQualifications from './otherQualificationsMapper'
import {
  aCiagInductionWithOtherQualifications,
  aCiagInductionWithNoOtherQualifications,
} from '../../testsupport/ciagInductionTestDataBuilder'

describe('otherQualificationsMapper', () => {
  it('should map to Other Qualifications given no CIAG Induction', () => {
    // Given
    const ciagInduction: CiagInduction = undefined

    const expected: OtherQualifications = {
      problemRetrievingData: false,
      inductionQuestionSet: undefined,
      highestEducationLevel: undefined,
      additionalTraining: undefined,
    }

    // When
    const actual = toOtherQualifications(ciagInduction)

    // Then
    expect(actual).toEqual(expected)
  })

  describe('inductionQuestionSet mapping', () => {
    Array.of(
      { hopingToGetWork: 'YES', expectedInductionQuestionSet: 'LONG_QUESTION_SET' },
      { hopingToGetWork: 'NO', expectedInductionQuestionSet: 'SHORT_QUESTION_SET' },
      { hopingToGetWork: 'NOT_SURE', expectedInductionQuestionSet: 'SHORT_QUESTION_SET' },
    ).forEach(fixture => {
      it(`should map to Other Qualifications given CIAG Induction where hoping to get work is ${fixture.hopingToGetWork}`, () => {
        // Given
        const ciagInduction = aCiagInductionWithOtherQualifications()
        ciagInduction.hopingToGetWork = fixture.hopingToGetWork

        // When
        const actual = toOtherQualifications(ciagInduction)

        // Then
        expect(actual.inductionQuestionSet).toEqual(fixture.expectedInductionQuestionSet)
      })
    })
  })

  it('should map to Other Qualifications given CIAG Induction with qualifications and training data', () => {
    // Given
    const ciagInduction: CiagInduction = aCiagInductionWithOtherQualifications()

    const expected: OtherQualifications = {
      problemRetrievingData: false,
      inductionQuestionSet: 'LONG_QUESTION_SET',
      highestEducationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
      additionalTraining: ['FIRST_AID_CERTIFICATE', 'MANUAL_HANDLING'],
    }

    // When
    const actual = toOtherQualifications(ciagInduction)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to Other Qualifications given CIAG Induction without qualifications and training data', () => {
    // Given
    const ciagInduction: CiagInduction = aCiagInductionWithNoOtherQualifications()

    const expected: OtherQualifications = {
      problemRetrievingData: false,
      inductionQuestionSet: 'LONG_QUESTION_SET',
      highestEducationLevel: undefined,
      additionalTraining: undefined,
    }

    // When
    const actual = toOtherQualifications(ciagInduction)

    // Then
    expect(actual).toEqual(expected)
  })
})
