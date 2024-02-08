import moment from 'moment/moment'
import type { WorkAndInterests } from 'viewModels'
import type { InductionResponse } from 'educationAndWorkPlanApiClient'
import toWorkAndInterests from './workAndInterestMapper'
import {
  aLongQuestionSetInduction,
  aShortQuestionSetInduction,
} from '../../testsupport/inductionResponseTestDataBuilder'

describe('workAndInterestMapper', () => {
  it('should map to Work And Interests given no Induction', () => {
    // Given
    const induction: InductionResponse = undefined

    const expected: WorkAndInterests = {
      problemRetrievingData: false,
      inductionQuestionSet: undefined,
      data: undefined,
    }

    // When
    const actual = toWorkAndInterests(induction)

    // Then
    expect(actual).toEqual(expected)
  })

  describe('Long question set Induction', () => {
    it('should map to Work And Interests given Induction has worked before, and has skills and interests', () => {
      // Given
      const induction = aLongQuestionSetInduction({
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
            updatedAt: moment('2023-06-19T09:39:44.000Z').toDate(),
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
          workExperience: {
            hasWorkedPreviously: true,
            updatedAt: moment('2023-06-19T09:39:44.000Z').toDate(),
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            jobs: [
              {
                type: 'CONSTRUCTION',
                role: 'General labourer',
                responsibilities: 'Groundwork and basic block work and bricklaying',
                other: null,
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
              constraintsOnAbilityToWork: ['NONE'],
              jobs: [
                {
                  jobType: 'RETAIL',
                  otherJobType: null,
                  specificJobRole: null,
                },
                {
                  jobType: 'CONSTRUCTION',
                  otherJobType: null,
                  specificJobRole: 'General labourer',
                },
                {
                  jobType: 'OTHER',
                  otherJobType: 'Film, TV and media',
                  specificJobRole: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
                },
              ],
              otherConstraintOnAbilityToWork: null,
            },
            shortQuestionSetAnswers: undefined,
            updatedAt: moment('2023-06-19T09:39:44.000Z').toDate(),
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
        },
      }

      // When
      const actual = toWorkAndInterests(induction)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to Work And Interests given Induction was updated more recently than the work interests', () => {
      // Given
      const mostRecentModifiedTimestamp = moment()
      const earlierModifiedTimeStamp = moment().subtract(1, 'minute')

      const induction = aLongQuestionSetInduction({
        updatedBy: 'USER1_GEN',
        updatedAt: mostRecentModifiedTimestamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      })
      induction.futureWorkInterests.updatedBy = 'USER2_GEN'
      induction.futureWorkInterests.updatedAt = earlierModifiedTimeStamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ')

      // When
      const actual = toWorkAndInterests(induction)

      // Then
      expect(actual.data.workInterests.updatedBy).toEqual('USER1_GEN')
      expect(actual.data.workInterests.updatedAt).toEqual(mostRecentModifiedTimestamp.toDate())
    })

    it('should map to Work And Interests given the work interests were updated more recently than the Induction', () => {
      // Given
      const mostRecentModifiedTimestamp = moment()
      const earlierModifiedTimeStamp = moment().subtract(1, 'minute')

      const induction = aLongQuestionSetInduction({
        updatedBy: 'USER1_GEN',
        updatedAt: earlierModifiedTimeStamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      })
      induction.futureWorkInterests.updatedBy = 'USER2_GEN'
      induction.futureWorkInterests.updatedAt = mostRecentModifiedTimestamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ')

      // When
      const actual = toWorkAndInterests(induction)

      // Then
      expect(actual.data.workInterests.updatedBy).toEqual('USER2_GEN')
      expect(actual.data.workInterests.updatedAt).toEqual(mostRecentModifiedTimestamp.toDate())
    })

    it('should map to Work And Interests given Induction has not worked before, and has no skills or interests', () => {
      // Given
      const induction = aLongQuestionSetInduction({
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
            updatedAt: moment('2023-06-19T09:39:44.000Z').toDate(),
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
          workExperience: {
            hasWorkedPreviously: false,
            updatedAt: moment('2023-06-19T09:39:44.000Z').toDate(),
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            jobs: [],
          },
          workInterests: {
            hopingToWorkOnRelease: 'YES',
            longQuestionSetAnswers: {
              constraintsOnAbilityToWork: ['NONE'],
              jobs: [
                {
                  jobType: 'RETAIL',
                  otherJobType: null,
                  specificJobRole: null,
                },
                {
                  jobType: 'CONSTRUCTION',
                  otherJobType: null,
                  specificJobRole: 'General labourer',
                },
                {
                  jobType: 'OTHER',
                  otherJobType: 'Film, TV and media',
                  specificJobRole: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
                },
              ],
              otherConstraintOnAbilityToWork: null,
            },
            shortQuestionSetAnswers: undefined,
            updatedAt: moment('2023-06-19T09:39:44.000Z').toDate(),
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
        },
      }

      // When
      const actual = toWorkAndInterests(induction)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('Short question set Induction', () => {
    it('should map to Work And Interests given Induction', () => {
      // Given
      const induction = aShortQuestionSetInduction()

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
            updatedAt: moment('2023-06-19T09:39:44.000Z').toDate(),
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
        },
      }

      // When
      const actual = toWorkAndInterests(induction)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to Work And Interests given Induction was updated more recently than the in-prison interests', () => {
      // Given
      const mostRecentModifiedTimestamp = moment()
      const earlierModifiedTimeStamp = moment().subtract(1, 'minute')

      const induction = aShortQuestionSetInduction({
        updatedBy: 'USER1_GEN',
        updatedAt: mostRecentModifiedTimestamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      })
      induction.inPrisonInterests.updatedBy = 'USER2_GEN'
      induction.inPrisonInterests.updatedAt = earlierModifiedTimeStamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ')

      // When
      const actual = toWorkAndInterests(induction)

      // Then
      expect(actual.data.workInterests.updatedBy).toEqual('USER1_GEN')
      expect(actual.data.workInterests.updatedAt).toEqual(mostRecentModifiedTimestamp.toDate())
    })

    it('should map to Work And Interests given the in-prison interests were updated more recently than the Induction', () => {
      // Given
      const mostRecentModifiedTimestamp = moment()
      const earlierModifiedTimeStamp = moment().subtract(1, 'minute')

      const induction = aShortQuestionSetInduction({
        updatedBy: 'USER1_GEN',
        updatedAt: earlierModifiedTimeStamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      })
      induction.inPrisonInterests.updatedBy = 'USER2_GEN'
      induction.inPrisonInterests.updatedAt = mostRecentModifiedTimestamp.format('YYYY-MM-DDTHH:mm:ss.SSSZ')

      // When
      const actual = toWorkAndInterests(induction)

      // Then
      expect(actual.data.workInterests.updatedBy).toEqual('USER2_GEN')
      expect(actual.data.workInterests.updatedAt).toEqual(mostRecentModifiedTimestamp.toDate())
    })
  })
})
