import type { LearnerEductionPagedResponse } from 'curiousApiClient'
import type { FunctionalSkills, Neurodiversity, InPrisonEducationRecords, PrisonerSupportNeeds } from 'viewModels'
import moment from 'moment'
import { CuriousClient, HmppsAuthClient } from '../data'
import CuriousService from './curiousService'
import aValidLearnerProfile from '../testsupport/learnerProfileTestDataBuilder'
import aValidLearnerNeurodivergence from '../testsupport/learnerNeurodivergenceTestDataBuilder'
import {
  learnerEducationPagedResponsePage1Of1,
  learnerEducationPagedResponsePage1Of2,
  learnerEducationPagedResponsePage2Of2,
} from '../testsupport/learnerEducationPagedResponseTestDataBuilder'

describe('curiousService', () => {
  const hmppsAuthClient = {
    getSystemClientToken: jest.fn(),
  }
  const curiousClient = {
    getLearnerProfile: jest.fn(),
    getLearnerNeurodivergence: jest.fn(),
    getLearnerEducationPage: jest.fn(),
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
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const learnerProfiles = [aValidLearnerProfile()]
      curiousClient.getLearnerProfile.mockResolvedValue(learnerProfiles)

      const learnerNeurodivergences = [aValidLearnerNeurodivergence()]
      curiousClient.getLearnerNeurodivergence.mockResolvedValue(learnerNeurodivergences)

      const expectedSupportNeeds: PrisonerSupportNeeds = {
        problemRetrievingData: false,
        healthAndSupportNeeds: [
          {
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            primaryLddAndHealthNeeds: 'Visual impairment',
            additionalLddAndHealthNeeds: ['Hearing impairment'],
          },
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
          },
        ],
      }

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
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getLearnerProfile.mockRejectedValue(curiousApiError)

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
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const learnerProfiles = [aValidLearnerProfile()]
      curiousClient.getLearnerProfile.mockResolvedValue(learnerProfiles)

      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getLearnerNeurodivergence.mockRejectedValue(curiousApiError)

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
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const curiousApi404Error = {
        message: 'Not Found',
        status: 404,
        text: { errorCode: 'VC4004', errorMessage: 'Resource not found', httpStatusCode: 404 },
      }
      curiousClient.getLearnerProfile.mockRejectedValue(curiousApi404Error)

      const learnerNeurodivergences = [aValidLearnerNeurodivergence()]
      curiousClient.getLearnerNeurodivergence.mockResolvedValue(learnerNeurodivergences)

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
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const learnerProfiles = [aValidLearnerProfile()]
      curiousClient.getLearnerProfile.mockResolvedValue(learnerProfiles)

      const curiousApi404Error = {
        message: 'Not Found',
        status: 404,
        text: { errorCode: 'VC4004', errorMessage: 'Resource not found', httpStatusCode: 404 },
      }
      curiousClient.getLearnerNeurodivergence.mockRejectedValue(curiousApi404Error)

      const expectedSupportNeeds: PrisonerSupportNeeds = {
        problemRetrievingData: false,
        healthAndSupportNeeds: [
          {
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            primaryLddAndHealthNeeds: 'Visual impairment',
            additionalLddAndHealthNeeds: ['Hearing impairment'],
          },
        ],
        neurodiversities: undefined,
      }

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
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const learnerProfiles = [aValidLearnerProfile()]
      curiousClient.getLearnerProfile.mockResolvedValue(learnerProfiles)

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
        prisonNumber,
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
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const curiousApi404Error = {
        message: 'Not Found',
        status: 404,
        text: { errorCode: 'VC4004', errorMessage: 'Resource not found', httpStatusCode: 404 },
      }
      curiousClient.getLearnerProfile.mockRejectedValue(curiousApi404Error)

      const expectedFunctionalSkills = {
        problemRetrievingData: false,
        assessments: undefined,
        prisonNumber,
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
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getLearnerProfile.mockRejectedValue(curiousApiError)

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

  describe('getLearnerEducation', () => {
    it('should get learner eduction given there is only 1 page of data in Curious for the prisoner', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const learnerEducationPage1Of1: LearnerEductionPagedResponse = learnerEducationPagedResponsePage1Of1(prisonNumber)
      curiousClient.getLearnerEducationPage.mockResolvedValue(learnerEducationPage1Of1)

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [
          {
            courseCode: '008ENGL06',
            courseName: 'GCSE English',
            courseStartDate: moment('2021-06-01').toDate(),
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            courseCompleted: false,
            courseCompletionDate: null,
            isAccredited: false,
            grade: null,
            source: 'CURIOUS',
          },
          {
            courseCode: '246674',
            courseName: 'GCSE Maths',
            courseStartDate: moment('2016-05-18').toDate(),
            prisonId: 'WDI',
            prisonName: 'WAKEFIELD (HMP)',
            courseCompleted: true,
            courseCompletionDate: moment('2016-07-15').toDate(),
            isAccredited: true,
            grade: 'No achievement',
            source: 'CURIOUS',
          },
        ],
      }

      // When
      const actual = await curiousService.getLearnerEducation(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 0)
    })

    it('should get learner eduction given there are 2 pages of data in Curious for the prisoner', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const learnerEducationPage1Of2: LearnerEductionPagedResponse = learnerEducationPagedResponsePage1Of2(prisonNumber)
      curiousClient.getLearnerEducationPage.mockResolvedValueOnce(learnerEducationPage1Of2)
      const learnerEducationPage2Of2: LearnerEductionPagedResponse = learnerEducationPagedResponsePage2Of2(prisonNumber)
      curiousClient.getLearnerEducationPage.mockResolvedValueOnce(learnerEducationPage2Of2)

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [
          {
            courseCode: '008ENGL06',
            courseName: 'GCSE English',
            courseStartDate: moment('2021-06-01').toDate(),
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            courseCompleted: false,
            courseCompletionDate: null,
            isAccredited: false,
            grade: null,
            source: 'CURIOUS',
          },
          {
            courseCode: '246674',
            courseName: 'GCSE Maths',
            courseStartDate: moment('2016-05-18').toDate(),
            prisonId: 'WDI',
            prisonName: 'WAKEFIELD (HMP)',
            courseCompleted: true,
            courseCompletionDate: moment('2016-07-15').toDate(),
            isAccredited: true,
            grade: 'No achievement',
            source: 'CURIOUS',
          },
          {
            courseCode: '008WOOD06',
            courseName: 'City & Guilds Wood Working',
            courseStartDate: moment('2021-06-01').toDate(),
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            courseCompleted: false,
            courseCompletionDate: null,
            isAccredited: false,
            grade: null,
            source: 'CURIOUS',
          },
        ],
      }

      // When
      const actual = await curiousService.getLearnerEducation(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 0)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 1)
    })

    it('should not get learner education given the curious API request for page 1 returns an error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getLearnerEducationPage.mockRejectedValue(curiousApiError)

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: true,
        educationRecords: undefined,
      }

      // When
      const actual = await curiousService.getLearnerEducation(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 0)
    })

    it('should not get learner education given the Curious API request for page 2 returns an error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const learnerEducationPage1Of2: LearnerEductionPagedResponse = learnerEducationPagedResponsePage1Of2(prisonNumber)
      curiousClient.getLearnerEducationPage.mockResolvedValueOnce(learnerEducationPage1Of2)

      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getLearnerEducationPage.mockRejectedValueOnce(curiousApiError)

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: true,
        educationRecords: undefined,
      }

      // When
      const actual = await curiousService.getLearnerEducation(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 0)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 1)
    })

    it('should handle retrieval of learner education given Curious returns not found error for the learner education', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const curiousApi404Error = {
        message: 'Not Found',
        status: 404,
        text: { errorCode: 'VC4004', errorMessage: 'Resource not found', httpStatusCode: 404 },
      }
      curiousClient.getLearnerEducationPage.mockRejectedValue(curiousApi404Error)

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: undefined,
      }

      // When
      const actual = await curiousService.getLearnerEducation(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 0)
    })
  })
})
