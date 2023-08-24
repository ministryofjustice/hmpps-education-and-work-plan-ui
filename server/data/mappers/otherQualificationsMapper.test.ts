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
      highestEducationLevel: undefined,
      additionalTraining: undefined,
    }

    // When
    const actual = toOtherQualifications(ciagInduction)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to Other Qualifications given CIAG Induction with qualifications and training data', () => {
    // Given
    const ciagInduction: CiagInduction = aCiagInductionWithOtherQualifications()

    const expected: OtherQualifications = {
      problemRetrievingData: false,
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
      highestEducationLevel: undefined,
      additionalTraining: undefined,
    }

    // When
    const actual = toOtherQualifications(ciagInduction)

    // Then
    expect(actual).toEqual(expected)
  })
})
