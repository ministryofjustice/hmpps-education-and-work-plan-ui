import moment from 'moment'
import type { CiagInduction } from 'ciagInductionApiClient'
import type { WorkAndInterests } from 'viewModels'
import {
  aLongQuestionSetCiagInduction,
  aShortQuestionSetCiagInduction,
} from '../../testsupport/ciagInductionTestDataBuilder'
import toWorkAndInterests from './workAndInterestMapper'

describe('workAndInterestMapper', () => {
  it('should map to Work And Interests given no CIAG Induction', () => {
    // Given
    const ciagInduction: CiagInduction = undefined

    const expected: WorkAndInterests = {
      problemRetrievingData: false,
      inductionQuestionSet: undefined,
      data: undefined,
    }

    // When
    const actual = toWorkAndInterests(ciagInduction)

    // Then
    expect(actual).toEqual(expected)
  })

  describe('Long question set CIAG Induction', () => {
    it('should map to Work And Interests given CIAG Induction has worked before, and has skills and interests', () => {
      // Given
      const ciagInduction = aLongQuestionSetCiagInduction({
        hasWorkedBefore: true,
        hasSkills: true,
        hasInterests: true,
      })

      const expected: WorkAndInterests = {
        problemRetrievingData: false,
        inductionQuestionSet: 'LONG_QUESTION_SET',
        data: {
          skillsAndInterests: {
            skills: ['TEAMWORK', 'WILLINGNESS_TO_LEARN', 'OTHER'],
            otherSkill: 'Tenacity',
            personalInterests: ['CREATIVE', 'DIGITAL', 'OTHER'],
            otherPersonalInterest: 'Renewable energy',
            updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
            updatedBy: 'ANOTHER_DPS_USER_GEN',
          },
          workExperience: {
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
          },
          workInterests: {
            hopingToWorkOnRelease: 'YES',
            longQuestionSetAnswers: {
              constraintsOnAbilityToWork: undefined,
              jobs: [
                {
                  jobType: 'RETAIL',
                  specificJobRole: undefined,
                },
                {
                  jobType: 'CONSTRUCTION',
                  specificJobRole: 'General labourer',
                },
                {
                  jobType: 'OTHER',
                  specificJobRole: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
                },
              ],
              otherConstraintOnAbilityToWork: undefined,
            },
            shortQuestionSetAnswers: undefined,
            updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
            updatedBy: 'ANOTHER_DPS_USER_GEN',
          },
        },
      }

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to Work And Interests given CIAG Induction was updated more recently than the work interests', () => {
      // Given
      const mostRecentModifiedTimestamp = moment()
      const earlierModifiedTimeStamp = moment().subtract(1, 'minute')

      const ciagInduction = aLongQuestionSetCiagInduction({
        modifiedBy: 'USER1_GEN',
        modifiedByDateTime: mostRecentModifiedTimestamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        workInterestModifiedBy: 'USER2_GEN',
        workInterestModifiedByDateTime: earlierModifiedTimeStamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      })

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual.data.workInterests.updatedBy).toEqual('USER1_GEN')
      expect(actual.data.workInterests.updatedAt).toEqual(mostRecentModifiedTimestamp.toDate())
    })

    it('should map to Work And Interests given the work interests were updated more recently than the CIAG Induction', () => {
      // Given
      const mostRecentModifiedTimestamp = moment()
      const earlierModifiedTimeStamp = moment().subtract(1, 'minute')

      const ciagInduction = aLongQuestionSetCiagInduction({
        modifiedBy: 'USER1_GEN',
        modifiedByDateTime: earlierModifiedTimeStamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        workInterestModifiedBy: 'USER2_GEN',
        workInterestModifiedByDateTime: mostRecentModifiedTimestamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      })

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual.data.workInterests.updatedBy).toEqual('USER2_GEN')
      expect(actual.data.workInterests.updatedAt).toEqual(mostRecentModifiedTimestamp.toDate())
    })

    it('should map to Work And Interests given CIAG Induction has not worked before, and has no skills or interests', () => {
      // Given
      const ciagInduction = aLongQuestionSetCiagInduction({
        hasWorkedBefore: false,
        hasSkills: false,
        hasInterests: false,
      })

      const expected: WorkAndInterests = {
        problemRetrievingData: false,
        inductionQuestionSet: 'LONG_QUESTION_SET',
        data: {
          skillsAndInterests: {
            skills: [],
            otherSkill: undefined,
            personalInterests: [],
            otherPersonalInterest: undefined,
            updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
            updatedBy: 'ANOTHER_DPS_USER_GEN',
          },
          workExperience: {
            hasWorkedPreviously: false,
            updatedBy: 'ANOTHER_DPS_USER_GEN',
            updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
            jobs: [],
          },
          workInterests: {
            hopingToWorkOnRelease: 'YES',
            longQuestionSetAnswers: {
              constraintsOnAbilityToWork: undefined,
              jobs: [
                {
                  jobType: 'RETAIL',
                  specificJobRole: undefined,
                },
                {
                  jobType: 'CONSTRUCTION',
                  specificJobRole: 'General labourer',
                },
                {
                  jobType: 'OTHER',
                  specificJobRole: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
                },
              ],
              otherConstraintOnAbilityToWork: undefined,
            },
            shortQuestionSetAnswers: undefined,
            updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
            updatedBy: 'ANOTHER_DPS_USER_GEN',
          },
        },
      }

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('Short question set CIAG Induction', () => {
    it('should map to Work And Interests given CIAG Induction', () => {
      // Given
      const ciagInduction = aShortQuestionSetCiagInduction()

      const expected: WorkAndInterests = {
        problemRetrievingData: false,
        inductionQuestionSet: 'SHORT_QUESTION_SET',
        data: {
          skillsAndInterests: undefined,
          workExperience: undefined,
          workInterests: {
            hopingToWorkOnRelease: 'NO',
            longQuestionSetAnswers: undefined,
            shortQuestionSetAnswers: {
              reasonsForNotWantingToWork: ['HEALTH', 'OTHER'],
              otherReasonForNotWantingToWork: 'Will be of retirement age at release',
              inPrisonWorkInterests: ['CLEANING_AND_HYGIENE', 'OTHER'],
              otherInPrisonerWorkInterest: 'Gardening and grounds keeping',
            },
            updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
            updatedBy: 'ANOTHER_DPS_USER_GEN',
          },
        },
      }

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to Work And Interests given CIAG Induction was updated more recently than the in-prison interests', () => {
      // Given
      const mostRecentModifiedTimestamp = moment()
      const earlierModifiedTimeStamp = moment().subtract(1, 'minute')

      const ciagInduction = aShortQuestionSetCiagInduction({
        modifiedBy: 'USER1_GEN',
        modifiedByDateTime: mostRecentModifiedTimestamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        inPrisonInterestsModifiedBy: 'USER2_GEN',
        inPrisonInterestsModifiedByDateTime: earlierModifiedTimeStamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      })

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual.data.workInterests.updatedBy).toEqual('USER1_GEN')
      expect(actual.data.workInterests.updatedAt).toEqual(mostRecentModifiedTimestamp.toDate())
    })

    it('should map to Work And Interests given the in-prison interests were updated more recently than the CIAG Induction', () => {
      // Given
      const mostRecentModifiedTimestamp = moment()
      const earlierModifiedTimeStamp = moment().subtract(1, 'minute')

      const ciagInduction = aShortQuestionSetCiagInduction({
        modifiedBy: 'USER1_GEN',
        modifiedByDateTime: earlierModifiedTimeStamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        inPrisonInterestsModifiedBy: 'USER2_GEN',
        inPrisonInterestsModifiedByDateTime: mostRecentModifiedTimestamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      })

      // When
      const actual = toWorkAndInterests(ciagInduction)

      // Then
      expect(actual.data.workInterests.updatedBy).toEqual('USER2_GEN')
      expect(actual.data.workInterests.updatedAt).toEqual(mostRecentModifiedTimestamp.toDate())
    })
  })
})
