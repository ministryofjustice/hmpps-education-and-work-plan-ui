import moment from 'moment'
import type { CiagInduction } from 'ciagInductionApiClient'
import type { WorkAndInterests, WorkExperience, WorkInterests } from 'viewModels'
import {
  aCiagInductionWithJobInterests,
  aCiagInductionWithNoJobInterests,
  aCiagInductionWithNoPreviousWorkExperience,
  aCiagInductionWithNoRecordOfAnyPreviousWorkExperience,
  aCiagInductionWithNoRecordOfAnyWorkInterests,
  aCiagInductionWithPreviousWorkExperience,
} from '../../testsupport/ciagInductionTestDataBuilder'
import toWorkAndInterests from './workAndInterestMapper'

describe('workAndInterestMapper', () => {
  it('should map to Work And Interests given no CIAG Induction', () => {
    // Given
    const ciagInduction: CiagInduction = undefined

    const expected: WorkAndInterests = {
      problemRetrievingData: false,
      data: undefined,
    }

    // When
    const actual = toWorkAndInterests(ciagInduction)

    // Then
    expect(actual).toEqual(expected)
  })

  describe('workExperience mapping', () => {
    it('should map to Work And Interests given CIAG Induction with previous work experience', () => {
      // Given
      const ciagInduction = aCiagInductionWithPreviousWorkExperience()

      const expectedWorkExperience: WorkExperience = {
        hasWorkedPreviously: true,
        updatedBy: 'ANOTHER_DPS_USER_GEN',
        updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
        jobs: [
          {
            type: 'CONSTRUCTION',
            role: 'General labourer',
            responsibilities: 'Groundwork and basic block work and bricklaying',
            other: undefined,
          },
          {
            type: 'OTHER',
            other: 'Retail delivery',
            role: 'Milkman',
            responsibilities: 'Self employed franchise operator delivering milk and associated diary products.',
          },
        ],
      }

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual.data.workExperience).toEqual(expectedWorkExperience)
    })

    it('should map to Work And Interests given CIAG Induction with no previous work experience', () => {
      // Given
      const ciagInduction = aCiagInductionWithNoPreviousWorkExperience()

      const expectedWorkExperience: WorkExperience = {
        hasWorkedPreviously: false,
        updatedBy: 'ANOTHER_DPS_USER_GEN',
        updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
        jobs: undefined,
      }

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual.data.workExperience).toEqual(expectedWorkExperience)
    })

    it('should map to Work And Interests given CIAG Induction with no record of any previous work experience', () => {
      // Given
      const ciagInduction = aCiagInductionWithNoRecordOfAnyPreviousWorkExperience()

      const expectedWorkExperience: WorkExperience = undefined

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual.data.workExperience).toEqual(expectedWorkExperience)
    })
  })

  describe('workInterest mapping', () => {
    it('should map to Work And Interests given CIAG Induction with some job interests', () => {
      // Given
      const ciagInduction = aCiagInductionWithJobInterests()

      const expectedWorkInterests: WorkInterests = {
        hopingToWorkOnRelease: 'YES',
        constraintsOnAbilityToWork: ['LIMITED_BY_OFFENSE'],
        otherConstraintOnAbilityToWork: undefined,
        jobTypes: ['CONSTRUCTION', 'OTHER'],
        specificJobRoles: [
          'General labourer',
          'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        ],
        updatedBy: 'ANOTHER_DPS_USER_GEN',
        updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
      }

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual.data.workInterests).toEqual(expectedWorkInterests)
    })

    it('should map to Work And Interests given CIAG Induction with no job interests', () => {
      // Given
      const ciagInduction = aCiagInductionWithNoJobInterests()

      const expectedWorkInterests: WorkInterests = {
        hopingToWorkOnRelease: 'NOT_SURE',
        constraintsOnAbilityToWork: ['CARING_RESPONSIBILITIES', 'OTHER'],
        otherConstraintOnAbilityToWork: 'Generally a bit lazy',
        jobTypes: undefined,
        specificJobRoles: undefined,
        updatedBy: 'ANOTHER_DPS_USER_GEN',
        updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
      }

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual.data.workInterests).toEqual(expectedWorkInterests)
    })

    it('should map to Work And Interests given CIAG Induction with no record of any work interests', () => {
      // Given
      const ciagInduction = aCiagInductionWithNoRecordOfAnyWorkInterests()

      const expectedWorkInterests: WorkInterests = undefined

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual.data.workInterests).toEqual(expectedWorkInterests)
    })

    it('should map to Work And Interests given CIAG Induction with no record of any previous work experience', () => {
      // Given
      const ciagInduction = aCiagInductionWithNoRecordOfAnyPreviousWorkExperience()

      const expectedWorkInterests: WorkInterests = undefined

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual.data.workInterests).toEqual(expectedWorkInterests)
    })
  })
})
