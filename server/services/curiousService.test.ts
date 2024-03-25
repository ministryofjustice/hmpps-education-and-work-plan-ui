import type { LearnerEductionPagedResponse } from 'curiousApiClient'
import type { FunctionalSkills, Neurodiversity, InPrisonCourseRecords, PrisonerSupportNeeds, Prison } from 'viewModels'
import moment from 'moment'
import { CuriousClient, HmppsAuthClient } from '../data'
import CuriousService from './curiousService'
import aValidLearnerProfile from '../testsupport/learnerProfileTestDataBuilder'
import aValidLearnerNeurodivergence from '../testsupport/learnerNeurodivergenceTestDataBuilder'
import {
  learnerEducationPagedResponse,
  learnerEducationPagedResponsePage1Of1,
  learnerEducationPagedResponsePage1Of2,
  learnerEducationPagedResponsePage2Of2,
} from '../testsupport/learnerEducationPagedResponseTestDataBuilder'
import PrisonService from './prisonService'

describe('curiousService', () => {
  const hmppsAuthClient = {
    getSystemClientToken: jest.fn(),
  }
  const curiousClient = {
    getLearnerProfile: jest.fn(),
    getLearnerNeurodivergence: jest.fn(),
    getLearnerEducationPage: jest.fn(),
  }
  const prisonService = {
    lookupPrison: jest.fn(),
  }

  const curiousService = new CuriousService(
    hmppsAuthClient as unknown as HmppsAuthClient,
    curiousClient as unknown as CuriousClient,
    prisonService as unknown as PrisonService,
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
            supportNeededRecordedDate: moment('2022-02-18').utc().toDate(),
            selfDeclaredNeurodiversity: ['Dyslexia'],
            selfDeclaredRecordedDate: moment('2022-02-18').utc().toDate(),
            assessedNeurodiversity: ['No Identified Neurodiversity Need'],
            assessmentDate: moment('2022-05-18').utc().toDate(),
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
            supportNeededRecordedDate: moment('2022-02-18').utc().toDate(),
            selfDeclaredNeurodiversity: ['Dyslexia'],
            selfDeclaredRecordedDate: moment('2022-02-18').utc().toDate(),
            assessedNeurodiversity: ['No Identified Neurodiversity Need'],
            assessmentDate: moment('2022-05-18').utc().toDate(),
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
            assessmentDate: moment('2012-02-16').utc().toDate(),
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

  describe('getPrisonerInPrisonCourses', () => {
    const mockPrisonLookup = (prisonId: string): Prison => {
      let prisonName: string
      if (prisonId === 'MDI') {
        prisonName = 'Moorland (HMP & YOI)'
      } else if (prisonId === 'WDI') {
        prisonName = 'Wakefield (HMP)'
      } else {
        return undefined
      }
      return { prisonId, prisonName }
    }

    it('should get In Prison Courses', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonService.lookupPrison.mockImplementation(mockPrisonLookup)

      const learnerEducationPage1Of1: LearnerEductionPagedResponse = learnerEducationPagedResponse(prisonNumber)
      curiousClient.getLearnerEducationPage.mockResolvedValue(learnerEducationPage1Of1)

      const expected: InPrisonCourseRecords = {
        problemRetrievingData: false,
        prisonNumber,
        totalRecords: 5,
        coursesByStatus: {
          COMPLETED: [
            {
              courseCode: '008WOOD06',
              courseCompletionDate: moment().startOf('day').subtract(3, 'months').utc().toDate(),
              courseName: 'City & Guilds Wood Working',
              courseStartDate: moment('2021-06-01').utc().toDate(),
              coursePlannedEndDate: moment('2021-08-06').utc().toDate(),
              courseStatus: 'COMPLETED',
              grade: null,
              isAccredited: false,
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              source: 'CURIOUS',
            },
            {
              courseCode: '008ENGL06',
              courseCompletionDate: moment('2021-12-13').utc().toDate(),
              courseName: 'GCSE English',
              courseStartDate: moment('2021-06-01').utc().toDate(),
              courseStatus: 'COMPLETED',
              coursePlannedEndDate: moment('2021-08-06').utc().toDate(),
              grade: null,
              isAccredited: false,
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              source: 'CURIOUS',
            },
          ],
          IN_PROGRESS: [
            {
              courseCode: '008ENGL06',
              courseName: 'GCSE English',
              courseStartDate: moment('2021-06-01').utc().toDate(),
              coursePlannedEndDate: moment('2021-08-06').utc().toDate(),
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              courseStatus: 'IN_PROGRESS',
              courseCompletionDate: null,
              isAccredited: false,
              grade: null,
              source: 'CURIOUS',
            },
          ],
          WITHDRAWN: [
            {
              courseCode: '246674',
              courseName: 'GCSE Maths',
              courseStartDate: moment('2016-05-18').utc().toDate(),
              prisonId: 'WDI',
              prisonName: 'Wakefield (HMP)',
              courseStatus: 'WITHDRAWN',
              courseCompletionDate: moment('2016-07-15').utc().toDate(),
              coursePlannedEndDate: moment('2016-12-23').utc().toDate(),
              isAccredited: true,
              grade: 'No achievement',
              source: 'CURIOUS',
            },
          ],
          TEMPORARILY_WITHDRAWN: [
            {
              courseCode: '246674',
              courseCompletionDate: moment('2016-07-15').utc().toDate(),
              courseName: 'GCSE Maths',
              courseStartDate: moment('2016-05-18').utc().toDate(),
              coursePlannedEndDate: moment('2016-12-23').utc().toDate(),
              courseStatus: 'TEMPORARILY_WITHDRAWN',
              grade: 'No achievement',
              isAccredited: true,
              prisonId: 'WDI',
              prisonName: 'Wakefield (HMP)',
              source: 'CURIOUS',
            },
          ],
        },
        coursesCompletedInLast12Months: [
          {
            courseCode: '008WOOD06',
            courseCompletionDate: moment().startOf('day').subtract(3, 'months').utc().toDate(),
            courseName: 'City & Guilds Wood Working',
            courseStartDate: moment('2021-06-01').utc().toDate(),
            coursePlannedEndDate: moment('2021-08-06').utc().toDate(),
            courseStatus: 'COMPLETED',
            grade: null,
            isAccredited: false,
            prisonId: 'MDI',
            prisonName: 'Moorland (HMP & YOI)',
            source: 'CURIOUS',
          },
        ],
      }

      // When
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 0)
      expect(prisonService.lookupPrison).toHaveBeenCalledWith('MDI', username)
      expect(prisonService.lookupPrison).toHaveBeenCalledWith('WDI', username)
    })

    it('should get In Prison Courses given there is only 1 page of data in Curious for the prisoner', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonService.lookupPrison.mockImplementation(mockPrisonLookup)

      const learnerEducationPage1Of1: LearnerEductionPagedResponse = learnerEducationPagedResponsePage1Of1(prisonNumber)
      curiousClient.getLearnerEducationPage.mockResolvedValue(learnerEducationPage1Of1)

      const expected: InPrisonCourseRecords = {
        problemRetrievingData: false,
        prisonNumber,
        totalRecords: 2,
        coursesByStatus: {
          COMPLETED: [],
          IN_PROGRESS: [
            {
              courseCode: '008ENGL06',
              courseName: 'GCSE English',
              courseStartDate: moment('2021-06-01').utc().toDate(),
              coursePlannedEndDate: moment('2021-08-06').utc().toDate(),
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              courseStatus: 'IN_PROGRESS',
              courseCompletionDate: null,
              isAccredited: false,
              grade: null,
              source: 'CURIOUS',
            },
          ],
          WITHDRAWN: [
            {
              courseCode: '246674',
              courseName: 'GCSE Maths',
              courseStartDate: moment('2016-05-18').utc().toDate(),
              prisonId: 'WDI',
              prisonName: 'Wakefield (HMP)',
              courseStatus: 'WITHDRAWN',
              courseCompletionDate: moment('2016-07-15').utc().toDate(),
              coursePlannedEndDate: moment('2016-12-23').utc().toDate(),
              isAccredited: true,
              grade: 'No achievement',
              source: 'CURIOUS',
            },
          ],
          TEMPORARILY_WITHDRAWN: [],
        },
        coursesCompletedInLast12Months: [],
      }

      // When
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 0)
    })

    it('should get In Prison Courses given there are 2 pages of data in Curious for the prisoner', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const username = 'a-dps-user'

      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonService.lookupPrison.mockImplementation(mockPrisonLookup)

      const learnerEducationPage1Of2: LearnerEductionPagedResponse = learnerEducationPagedResponsePage1Of2(prisonNumber)
      curiousClient.getLearnerEducationPage.mockResolvedValueOnce(learnerEducationPage1Of2)
      const learnerEducationPage2Of2: LearnerEductionPagedResponse = learnerEducationPagedResponsePage2Of2(prisonNumber)
      curiousClient.getLearnerEducationPage.mockResolvedValueOnce(learnerEducationPage2Of2)

      const expected: InPrisonCourseRecords = {
        problemRetrievingData: false,
        prisonNumber,
        totalRecords: 3,
        coursesByStatus: {
          COMPLETED: [],
          IN_PROGRESS: [
            {
              courseCode: '008ENGL06',
              courseName: 'GCSE English',
              courseStartDate: moment('2021-06-01').utc().toDate(),
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              courseStatus: 'IN_PROGRESS',
              courseCompletionDate: null,
              coursePlannedEndDate: moment('2021-08-06').utc().toDate(),
              isAccredited: false,
              grade: null,
              source: 'CURIOUS',
            },
            {
              courseCode: '008WOOD06',
              courseName: 'City & Guilds Wood Working',
              courseStartDate: moment('2021-06-01').utc().toDate(),
              coursePlannedEndDate: moment('2021-08-06').utc().toDate(),
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              courseStatus: 'IN_PROGRESS',
              courseCompletionDate: null,
              isAccredited: false,
              grade: null,
              source: 'CURIOUS',
            },
          ],
          WITHDRAWN: [
            {
              courseCode: '246674',
              courseName: 'GCSE Maths',
              courseStartDate: moment('2016-05-18').utc().toDate(),
              prisonId: 'WDI',
              prisonName: 'Wakefield (HMP)',
              courseStatus: 'WITHDRAWN',
              courseCompletionDate: moment('2016-07-15').utc().toDate(),
              coursePlannedEndDate: moment('2016-12-23').utc().toDate(),
              isAccredited: true,
              grade: 'No achievement',
              source: 'CURIOUS',
            },
          ],
          TEMPORARILY_WITHDRAWN: [],
        },
        coursesCompletedInLast12Months: [],
      }

      // When
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 0)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 1)
    })

    it('should not get In Prison Courses given the curious API request for page 1 returns an error response', async () => {
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

      const expected = {
        problemRetrievingData: true,
      } as InPrisonCourseRecords

      // When
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 0)
      expect(prisonService.lookupPrison).not.toHaveBeenCalled()
    })

    it('should not get In Prison Courses given the Curious API request for page 2 returns an error response', async () => {
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

      const expected = {
        problemRetrievingData: true,
      } as InPrisonCourseRecords

      // When
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 0)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 1)
      expect(prisonService.lookupPrison).not.toHaveBeenCalled()
    })

    it('should handle retrieval of In Prison Courses given Curious returns not found error for the learner education', async () => {
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

      const expected: InPrisonCourseRecords = {
        problemRetrievingData: false,
        prisonNumber,
        totalRecords: 0,
        coursesByStatus: {
          COMPLETED: [],
          IN_PROGRESS: [],
          WITHDRAWN: [],
          TEMPORARILY_WITHDRAWN: [],
        },
        coursesCompletedInLast12Months: [],
      }

      // When
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, systemToken, 0)
      expect(prisonService.lookupPrison).not.toHaveBeenCalled()
    })
  })
})
