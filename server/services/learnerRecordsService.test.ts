import LearnerRecordsApiClient from '../data/learnerRecordsApiClient'
import LearnerRecordsService from './learnerRecordsService'
import { aVerifiedQualification, verifiedQualifications } from '../testsupport/verifiedQualificationsTestDataBuilder'
import aLearnerEventsResponse from '../testsupport/learnerRecordsApi/learnerEventsResponseTestDataBuilder'
import aLearningEvent from '../testsupport/learnerRecordsApi/learningEventTestDataBuilder'

jest.mock('../data/learnerRecordsApiClient')

describe('learnerRecordsService', () => {
  const learnerRecordsApiClient = new LearnerRecordsApiClient(null) as jest.Mocked<LearnerRecordsApiClient>
  const learnerRecordsService = new LearnerRecordsService(learnerRecordsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getVerifiedQualifications', () => {
    it('should get conditions', async () => {
      // Given
      const learnerEventsResponse = aLearnerEventsResponse({
        learnerRecords: [aLearningEvent({ source: 'AO', level: null })],
      })
      learnerRecordsApiClient.getLearnerEvents.mockResolvedValue(learnerEventsResponse)

      const expectedVerifiedQualifications = verifiedQualifications({
        qualifications: [aVerifiedQualification({ source: 'AO', level: null })],
      })

      // When
      const actual = await learnerRecordsService.getVerifiedQualifications(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedVerifiedQualifications)
      expect(learnerRecordsApiClient.getLearnerEvents).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should return Verified Qualifications given API returns null', async () => {
      // Given
      learnerRecordsApiClient.getLearnerEvents.mockResolvedValue(null)

      const expectedVerifiedQualifications = verifiedQualifications({
        prisonNumber,
        status: 'PRN_NOT_MATCHED_TO_LEARNER_RECORD',
        qualifications: [],
      })

      // When
      const actual = await learnerRecordsService.getVerifiedQualifications(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedVerifiedQualifications)
      expect(learnerRecordsApiClient.getLearnerEvents).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      learnerRecordsApiClient.getLearnerEvents.mockRejectedValue(expectedError)

      // When
      const actual = await learnerRecordsService.getVerifiedQualifications(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(learnerRecordsApiClient.getLearnerEvents).toHaveBeenCalledWith(prisonNumber, username)
    })
  })
})
