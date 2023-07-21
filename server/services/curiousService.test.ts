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
    it('should get prisoner support needs by prison number and establishment ID', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const learnerProfiles = [aValidLearnerProfile()]
      const learnerNeurodivergences = [aValidLearnerNeurodivergence()]

      const username = 'a-dps-user'
      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

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
      curiousClient.getLearnerProfile.mockImplementation(() => Promise.resolve(learnerProfiles))
      curiousClient.getLearnerNeurodivergence.mockImplementation(() => Promise.resolve(learnerNeurodivergences))

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(curiousClient.getLearnerNeurodivergence).toHaveBeenCalledWith(prisonNumber, systemToken)
    })

    it('should handle retrieval of prisoner support needs given Curious returns an unexpected error', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'
      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const expectedSupportNeeds = {
        problemRetrievingData: true,
        healthAndSupportNeeds: undefined,
        neurodiversities: undefined,
      } as PrisonerSupportNeeds
      curiousClient.getLearnerProfile.mockImplementation(() => Promise.reject(Error('Unavailable')))

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(curiousClient.getLearnerNeurodivergence).not.toHaveBeenCalled()
    })
  })

  // TODO figure out how to throw a 404 not found error
  it.skip('should handle retrieval of prisoner support needs given Curious returns not found error', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    const username = 'a-dps-user'
    const systemToken = 'a-system-token'
    hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

    const expectedSupportNeeds = {
      problemRetrievingData: false,
      healthAndSupportNeeds: undefined,
      neurodiversities: undefined,
    } as PrisonerSupportNeeds
    curiousClient.getLearnerProfile.mockImplementation(() => Promise.reject(Error('Unavailable')))

    // When
    const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, username).catch(error => {
      return error
    })

    // Then
    expect(actual).toEqual(expectedSupportNeeds)
    expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, systemToken)
    expect(curiousClient.getLearnerNeurodivergence).not.toHaveBeenCalled()
  })

  describe('getPrisonerFunctionalSkills', () => {
    it('should get prisoner functional skills', async () => {
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

    it('should not get prisoner functional skills given curious returns an error', async () => {
      // Given
      const prisonNumber = 'A1234BC'

      const username = 'a-dps-user'
      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      curiousClient.getLearnerProfile.mockImplementation(() => Promise.reject(Error('Not Found')))

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
