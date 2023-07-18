import type { SupportNeeds } from 'viewModels'
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

  describe('getLeanerProfile', () => {
    it('should get learner profile by prison number and establishment ID', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const establishmentId = 'MDI'
      const learnerProfile = aValidLearnerProfile()
      const learnerNeurodivergence = aValidLearnerNeurodivergence()

      const username = 'a-dps-user'
      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const expectedSupportNeeds = {
        languageSupportNeeded: false,
        lddAndHealthNeeds: ['Visual impairment', 'Hearing impairment'],
        neurodiversity: {
          supportNeeded: ['Writing support'],
          selfDeclaredNeurodiversity: ['Dyslexia'],
          assessedNeurodiversity: ['No Identified Neurodiversity Need'],
        },
      } as SupportNeeds
      curiousClient.getLearnerProfile.mockImplementation(() => Promise.resolve(learnerProfile))
      curiousClient.getLearnerNeurodivergence.mockImplementation(() => Promise.resolve(learnerNeurodivergence))

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, establishmentId, username)

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, establishmentId, systemToken)
      expect(curiousClient.getLearnerNeurodivergence).toHaveBeenCalledWith(prisonNumber, establishmentId, systemToken)
    })

    it('should not get learner profile given Curious returns an error', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const establishmentId = 'MDI'
      const username = 'a-dps-user'
      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      curiousClient.getLearnerProfile.mockImplementation(() => Promise.reject(Error('Not Found')))

      // When
      const actual = await curiousService
        .getPrisonerSupportNeeds(prisonNumber, establishmentId, username)
        .catch(error => {
          return error
        })

      // Then
      expect(actual).toEqual(Error('Not Found'))
    })
  })
})
