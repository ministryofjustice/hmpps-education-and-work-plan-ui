import type { CiagInduction } from 'ciagInductionApiClient'
import type { PrePrisonQualifications } from 'viewModels'
import toPrePrisonQualifications from './prePrisonQualificationsMapper'
import {
  aCiagInductionWithPrePrisonQualifications,
  aCiagInductionWithNoPrePrisonQualifications,
} from '../../testsupport/ciagInductionTestDataBuilder'

describe('prePrisonQualificationsMapper', () => {
  it('should map to Pre-Prison Qualifications given no CIAG Induction', () => {
    // Given
    const ciagInduction: CiagInduction = undefined

    const expected: PrePrisonQualifications = {
      problemRetrievingData: false,
      highestEducationLevel: undefined,
      additionalTraining: undefined,
    }

    // When
    const actual = toPrePrisonQualifications(ciagInduction)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to Pre-Prison Qualifications given CIAG Induction with qualifications and training data', () => {
    // Given
    const ciagInduction: CiagInduction = aCiagInductionWithPrePrisonQualifications()

    const expected: PrePrisonQualifications = {
      problemRetrievingData: false,
      highestEducationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
      additionalTraining: ['FIRST_AID_CERTIFICATE', 'MANUAL_HANDLING'],
    }

    // When
    const actual = toPrePrisonQualifications(ciagInduction)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to Pre-Prison Qualifications given CIAG Induction without qualifications and training data', () => {
    // Given
    const ciagInduction: CiagInduction = aCiagInductionWithNoPrePrisonQualifications()

    const expected: PrePrisonQualifications = {
      problemRetrievingData: false,
      highestEducationLevel: undefined,
      additionalTraining: undefined,
    }

    // When
    const actual = toPrePrisonQualifications(ciagInduction)

    // Then
    expect(actual).toEqual(expected)
  })
})
