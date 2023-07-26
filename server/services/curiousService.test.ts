import type { FunctionalSkills, HealthAndSupportNeeds, Neurodiversity, PrisonerSupportNeeds } from 'viewModels'
import moment from 'moment'
import { CuriousClient, HmppsAuthClient } from '../data'
import CuriousService from './curiousService'
import aValidLearnerProfile from '../testsupport/learnerProfileTestDataBuilder'
import aValidLearnerNeurodivergence from '../testsupport/learnerNeurodivergenceTestDataBuilder'

describe('curiousService', () => {
  const hmppsAuthClient = {
    getSystemClientToken: jest.fn(),
  }
  const curiousClient = {
    getLearnerProfile: jest.fn(),
    getLearnerNeurodivergence: jest.fn(),
  }

  const curiousService = new CuriousService(
    hmppsAuthClient as unknown as HmppsAuthClient,
    curiousClient as unknown as CuriousClient,
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getPrisonerSupportNeeds', () => {
    it('should get prisoner support needs given a known prison number', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const learnerProfiles = [aValidLearnerProfile()]
      curiousClient.getLearnerProfile.mockImplementation(() => Promise.resolve(learnerProfiles))

      const learnerNeurodivergences = [aValidLearnerNeurodivergence()]
      curiousClient.getLearnerNeurodivergence.mockImplementation(() => Promise.resolve(learnerNeurodivergences))

      const expectedSupportNeeds = {
        problemRetrievingData: false,
        healthAndSupportNeeds: [
          {
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            languageSupportNeeded: 'Bilingual',
            lddAndHealthNeeds: ['Visual impairment', 'Hearing impairment'],
          } as HealthAndSupportNeeds,
        ],
        neurodiversities: [
          {
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            supportNeeded: ['Writing support'],
            supportNeededRecordedDate: moment('2022-02-18').toDate(),
            selfDeclaredNeurodiversity: ['Dyslexia'],
            selfDeclaredRecordedDate: moment('2022-02-18').toDate(),
            assessedNeurodiversity: ['No Identified Neurodiversity Need'],
            assessmentDate: moment('2022-05-18').toDate(),
          } as Neurodiversity,
        ],
      } as PrisonerSupportNeeds

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(curiousClient.getLearnerNeurodivergence).toHaveBeenCalledWith(prisonNumber, systemToken)
    })

    it('should handle retrieval of prisoner support needs given Curious returns an unexpected error for the learner profile', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getLearnerProfile.mockImplementation(() => Promise.reject(curiousApiError))

      const expectedSupportNeeds = {
        problemRetrievingData: true,
        healthAndSupportNeeds: undefined,
        neurodiversities: undefined,
      } as PrisonerSupportNeeds

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(curiousClient.getLearnerNeurodivergence).not.toHaveBeenCalled()
    })

    it('should handle retrieval of prisoner support needs given Curious returns an unexpected error for the learner neuro divergences', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const learnerProfiles = [aValidLearnerProfile()]
      curiousClient.getLearnerProfile.mockImplementation(() => Promise.resolve(learnerProfiles))

      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getLearnerNeurodivergence.mockImplementation(() => Promise.reject(curiousApiError))

      const expectedSupportNeeds = {
        problemRetrievingData: true,
        healthAndSupportNeeds: undefined,
        neurodiversities: undefined,
      } as PrisonerSupportNeeds

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(curiousClient.getLearnerNeurodivergence).toHaveBeenCalledWith(prisonNumber, systemToken)
    })

    it('should handle retrieval of prisoner support needs given Curious returns not found error for the learner profile', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const curiousApi404Error = {
        message: 'Not Found',
        status: 404,
        text: { errorCode: 'VC4004', errorMessage: 'Resource not found', httpStatusCode: 404 },
      }
      curiousClient.getLearnerProfile.mockImplementation(() => Promise.reject(curiousApi404Error))

      const learnerNeurodivergences = [aValidLearnerNeurodivergence()]
      curiousClient.getLearnerNeurodivergence.mockImplementation(() => Promise.resolve(learnerNeurodivergences))

      const expectedSupportNeeds = {
        problemRetrievingData: false,
        healthAndSupportNeeds: undefined,
        neurodiversities: [
          {
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            supportNeeded: ['Writing support'],
            supportNeededRecordedDate: moment('2022-02-18').toDate(),
            selfDeclaredNeurodiversity: ['Dyslexia'],
            selfDeclaredRecordedDate: moment('2022-02-18').toDate(),
            assessedNeurodiversity: ['No Identified Neurodiversity Need'],
            assessmentDate: moment('2022-05-18').toDate(),
          } as Neurodiversity,
        ],
      } as PrisonerSupportNeeds

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(curiousClient.getLearnerNeurodivergence).toHaveBeenCalledWith(prisonNumber, systemToken)
    })

    it('should handle retrieval of prisoner support needs given Curious returns not found error for the learner neuro divergences', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const learnerProfiles = [aValidLearnerProfile()]
      curiousClient.getLearnerProfile.mockImplementation(() => Promise.resolve(learnerProfiles))

      const curiousApi404Error = {
        message: 'Not Found',
        status: 404,
        text: { errorCode: 'VC4004', errorMessage: 'Resource not found', httpStatusCode: 404 },
      }
      curiousClient.getLearnerNeurodivergence.mockImplementation(() => Promise.reject(curiousApi404Error))

      const expectedSupportNeeds = {
        problemRetrievingData: false,
        healthAndSupportNeeds: [
          {
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            languageSupportNeeded: 'Bilingual',
            lddAndHealthNeeds: ['Visual impairment', 'Hearing impairment'],
          } as HealthAndSupportNeeds,
        ],
        neurodiversities: undefined,
      } as PrisonerSupportNeeds

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(curiousClient.getLearnerNeurodivergence).toHaveBeenCalledWith(prisonNumber, systemToken)
    })
  })

  describe('getPrisonerFunctionalSkills', () => {
    it('should get prisoner functional skills given a known prison number', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const learnerProfiles = [aValidLearnerProfile()]
      curiousClient.getLearnerProfile.mockImplementation(() => Promise.resolve(learnerProfiles))

      const expectedFunctionalSkills = {
        problemRetrievingData: false,
        assessments: [
          {
            assessmentDate: moment('2012-02-16').toDate(),
            grade: 'Level 1',
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            type: 'ENGLISH',
          },
        ],
      } as FunctionalSkills

      // When
      const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedFunctionalSkills)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, systemToken)
    })

    it('should handle retrieval of prisoner functional skills given Curious returns not found error for the learner profile', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const curiousApi404Error = {
        message: 'Not Found',
        status: 404,
        text: { errorCode: 'VC4004', errorMessage: 'Resource not found', httpStatusCode: 404 },
      }
      curiousClient.getLearnerProfile.mockImplementation(() => Promise.reject(curiousApi404Error))

      const expectedFunctionalSkills = {
        problemRetrievingData: false,
        assessments: undefined,
      } as FunctionalSkills

      // When
      const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedFunctionalSkills)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, systemToken)
    })

    it('should handle retrieval of prisoner Functional Skills given Curious returns an unexpected error for the learner profile', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getLearnerProfile.mockImplementation(() => Promise.reject(curiousApiError))

      const expectedFunctionalSkills = {
        problemRetrievingData: true,
        assessments: undefined,
      } as FunctionalSkills

      // When
      const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedFunctionalSkills)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, systemToken)
    })
  })
})
