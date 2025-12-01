import { startOfDay } from 'date-fns'
import type { LearnerEventsResponse } from 'learnerRecordsApiClient'
import toVerifiedQualifications from './verifiedQualificationsMapper'
import { aVerifiedQualification, verifiedQualifications } from '../../testsupport/verifiedQualificationsTestDataBuilder'
import aLearnerEventsResponse from '../../testsupport/learnerRecordsApi/learnerEventsResponseTestDataBuilder'
import aLearningEvent from '../../testsupport/learnerRecordsApi/learningEventTestDataBuilder'

describe('verifiedQualificationsMapper', () => {
  const prisonNumber = 'A1234BC'

  describe('toVerifiedQualifications', () => {
    it('should map to Verified Qualifications given an exact match LearnerEventsResponse', () => {
      // Given
      const learnerEventsResponse: LearnerEventsResponse = aLearnerEventsResponse({
        responseType: 'Exact Match',
        learnerRecords: [
          aLearningEvent({
            subject: 'Maths',
            source: 'AO',
            qualificationType: 'Applied GCE Double Award',
            awardingOrganisationName: 'EDEXCEL Foundation',
            grade: 'D',
            level: 'Level 3',
            achievementAwardDate: startOfDay('2010-07-13'),
          }),
          aLearningEvent({
            subject: 'English',
            source: 'NPD',
            qualificationType: 'BTEC National Certificate',
            awardingOrganisationName: 'Welsh Joint Education Committee',
            grade: 'A',
            level: null,
            achievementAwardDate: startOfDay('2011-09-02'),
          }),
        ],
      })

      const expected = verifiedQualifications({
        prisonNumber,
        status: 'PRN_MATCHED_TO_LEARNER_RECORD',
        qualifications: [
          aVerifiedQualification({
            subject: 'Maths',
            source: 'AO',
            qualificationType: 'Applied GCE Double Award',
            awardingBodyName: 'EDEXCEL Foundation',
            grade: 'D',
            level: 'Level 3',
            awardedOn: startOfDay('2010-07-13'),
          }),
          aVerifiedQualification({
            subject: 'English',
            source: 'NPD',
            qualificationType: 'BTEC National Certificate',
            awardingBodyName: 'Welsh Joint Education Committee',
            grade: 'A',
            level: null,
            awardedOn: startOfDay('2011-09-02'),
          }),
        ],
      })

      // When
      const actual = toVerifiedQualifications(prisonNumber, learnerEventsResponse)

      // Then
      expect(actual).toEqual(expected)
    })

    it.each([
      'No Match',
      'Too Many Matches',
      'Possible Match',
      'Linked Learner Match',
      'Learner could not be verified',
    ] as Array<
      'No Match' | 'Too Many Matches' | 'Possible Match' | 'Linked Learner Match' | 'Learner could not be verified'
    >)('should map to Verified Qualifications given LearnerEventsResponse responseType is %s', responseType => {
      // Given
      const learnerEventsResponse: LearnerEventsResponse = aLearnerEventsResponse({
        responseType,
        learnerRecords: [aLearningEvent({ subject: 'Maths' }), aLearningEvent({ subject: 'English' })],
      })

      const expected = verifiedQualifications({
        prisonNumber,
        status: 'PRN_NOT_MATCHED_TO_LEARNER_RECORD',
        qualifications: [],
      })

      // When
      const actual = toVerifiedQualifications(prisonNumber, learnerEventsResponse)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to Verified Qualifications given LearnerEventsResponse where learner has declined to share data', () => {
      // Given
      const learnerEventsResponse: LearnerEventsResponse = aLearnerEventsResponse({
        responseType: 'Learner opted to not share data',
        learnerRecords: [aLearningEvent({ subject: 'Maths' }), aLearningEvent({ subject: 'English' })],
      })

      const expected = verifiedQualifications({
        prisonNumber,
        status: 'LEARNER_DECLINED_TO_SHARE_DATA',
        qualifications: [],
      })

      // When
      const actual = toVerifiedQualifications(prisonNumber, learnerEventsResponse)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to Verified Qualifications given no LearnerEventsResponse', () => {
      // Given
      const learnerEventsResponse: LearnerEventsResponse = null

      const expected = verifiedQualifications({
        prisonNumber,
        status: 'PRN_NOT_MATCHED_TO_LEARNER_RECORD',
        qualifications: [],
      })

      // When
      const actual = toVerifiedQualifications(prisonNumber, learnerEventsResponse)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
