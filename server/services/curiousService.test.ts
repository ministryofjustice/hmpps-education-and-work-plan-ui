import { startOfDay, startOfToday, sub } from 'date-fns'
import type { LearnerEductionPagedResponse } from 'curiousApiClient'
import type { FunctionalSkills, InPrisonCourseRecords, PrisonerSupportNeeds } from 'viewModels'
import CuriousClient from '../data/curiousClient'
import HmppsAuthClient from '../data/hmppsAuthClient'
import CuriousService from './curiousService'
import aValidLearnerProfile from '../testsupport/learnerProfileTestDataBuilder'
import {
  learnerEducationPagedResponse,
  learnerEducationPagedResponsePage1Of1,
  learnerEducationPagedResponsePage1Of2,
  learnerEducationPagedResponsePage2Of2,
} from '../testsupport/learnerEducationPagedResponseTestDataBuilder'
import PrisonService from './prisonService'

jest.mock('../data/curiousClient')
jest.mock('../data/hmppsAuthClient')
jest.mock('./prisonService')

describe('curiousService', () => {
  const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
  const curiousClient = new CuriousClient() as jest.Mocked<CuriousClient>
  const prisonService = new PrisonService(null, null, null) as jest.Mocked<PrisonService>
  const curiousService = new CuriousService(hmppsAuthClient, curiousClient, prisonService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const curiousClientToken = 'curious-client-token'

  beforeEach(() => {
    jest.resetAllMocks()
    hmppsAuthClient.getCuriousClientToken.mockResolvedValue(curiousClientToken)
  })

  describe('getPrisonerSupportNeeds', () => {
    it('should get prisoner support needs given a known prison number', async () => {
      // Given
      const prisonNamesById = new Map([['MDI', 'Moorland (HMP & YOI)']])
      prisonService.getAllPrisonNamesById.mockResolvedValue(prisonNamesById)

      const learnerProfiles = [
        {
          ...aValidLearnerProfile(),
          rapidAssessmentDate: '2022-02-18',
          inDepthAssessmentDate: '2022-02-18',
        },
      ]
      curiousClient.getLearnerProfile.mockResolvedValue(learnerProfiles)

      const expectedSupportNeeds: PrisonerSupportNeeds = {
        problemRetrievingData: false,
        healthAndSupportNeeds: [
          {
            prisonId: 'MDI',
            prisonName: 'Moorland (HMP & YOI)',
            rapidAssessmentDate: new Date('2022-02-18'),
            inDepthAssessmentDate: new Date('2022-02-18'),
            primaryLddAndHealthNeeds: 'Visual impairment',
            additionalLddAndHealthNeeds: ['Hearing impairment'],
            hasSupportNeeds: true,
          },
        ],
      }

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, curiousClientToken)
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })

    it('should handle retrieval of prisoner support needs given Curious returns an unexpected error for the learner profile', async () => {
      // Given
      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getLearnerProfile.mockRejectedValue(curiousApiError)

      const expectedSupportNeeds: PrisonerSupportNeeds = {
        problemRetrievingData: true,
        healthAndSupportNeeds: [],
      }

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, curiousClientToken)
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })

    it('should handle retrieval of prisoner support needs given Curious API client returns null indicating not found error for the learner profile', async () => {
      // Given
      curiousClient.getLearnerProfile.mockResolvedValue(null)

      const expectedSupportNeeds: PrisonerSupportNeeds = {
        problemRetrievingData: false,
        healthAndSupportNeeds: [],
      }

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, curiousClientToken)
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })
  })

  describe('getPrisonerFunctionalSkills', () => {
    it('should get prisoner functional skills given a known prison number', async () => {
      // Given
      const learnerProfiles = [aValidLearnerProfile()]
      curiousClient.getLearnerProfile.mockResolvedValue(learnerProfiles)

      const prisonNamesById = new Map([['MDI', 'Moorland (HMP & YOI)']])
      prisonService.getAllPrisonNamesById.mockResolvedValue(prisonNamesById)

      const expectedFunctionalSkills: FunctionalSkills = {
        problemRetrievingData: false,
        assessments: [
          {
            assessmentDate: startOfDay('2012-02-16'),
            grade: 'Level 1',
            prisonId: 'MDI',
            prisonName: 'Moorland (HMP & YOI)',
            type: 'ENGLISH',
          },
        ],
        prisonNumber,
      }

      // When
      const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedFunctionalSkills)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, curiousClientToken)
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })

    it('should handle retrieval of prisoner functional skills given Curious client returns null indicating not found error for the learner profile', async () => {
      // Given
      curiousClient.getLearnerProfile.mockResolvedValue(null)

      const expectedFunctionalSkills: FunctionalSkills = {
        problemRetrievingData: false,
        assessments: [],
        prisonNumber,
      }

      // When
      const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedFunctionalSkills)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, curiousClientToken)
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })

    it('should handle retrieval of prisoner Functional Skills given Curious returns an unexpected error for the learner profile', async () => {
      // Given
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
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, curiousClientToken)
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })
  })

  describe('getPrisonerInPrisonCourses', () => {
    const mockAllPrisonNameLookup = (): Promise<Map<string, string>> => {
      const prisonNamesById = new Map([
        ['MDI', 'Moorland (HMP & YOI)'],
        ['WDI', 'Wakefield (HMP)'],
      ])
      return Promise.resolve(prisonNamesById)
    }

    it('should get In Prison Courses', async () => {
      // Given
      prisonService.getAllPrisonNamesById.mockImplementation(mockAllPrisonNameLookup)

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
              courseCompletionDate: sub(startOfToday(), { months: 3 }),
              courseName: 'City & Guilds Wood Working',
              courseStartDate: startOfDay('2021-06-01'),
              coursePlannedEndDate: startOfDay('2021-08-06'),
              courseStatus: 'COMPLETED',
              grade: null,
              isAccredited: false,
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              withdrawalReason: null,
              source: 'CURIOUS',
            },
            {
              courseCode: '008ENGL06',
              courseCompletionDate: startOfDay('2021-12-13'),
              courseName: 'GCSE English',
              courseStartDate: startOfDay('2021-06-01'),
              courseStatus: 'COMPLETED',
              coursePlannedEndDate: startOfDay('2021-08-06'),
              grade: null,
              isAccredited: false,
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              withdrawalReason: null,
              source: 'CURIOUS',
            },
          ],
          IN_PROGRESS: [
            {
              courseCode: '008ENGL06',
              courseName: 'GCSE English',
              courseStartDate: startOfDay('2021-06-01'),
              coursePlannedEndDate: startOfDay('2021-08-06'),
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              courseStatus: 'IN_PROGRESS',
              courseCompletionDate: null,
              isAccredited: false,
              grade: null,
              withdrawalReason: null,
              source: 'CURIOUS',
            },
          ],
          WITHDRAWN: [
            {
              courseCode: '246674',
              courseName: 'GCSE Maths',
              courseStartDate: startOfDay('2016-05-18'),
              prisonId: 'WDI',
              prisonName: 'Wakefield (HMP)',
              courseStatus: 'WITHDRAWN',
              courseCompletionDate: startOfDay('2016-07-15'),
              coursePlannedEndDate: startOfDay('2016-12-23'),
              isAccredited: true,
              grade: 'No achievement',
              withdrawalReason: 'Significant ill health causing them to be unable to attend education',
              source: 'CURIOUS',
            },
          ],
          TEMPORARILY_WITHDRAWN: [
            {
              courseCode: '246674',
              courseCompletionDate: startOfDay('2016-07-15'),
              courseName: 'GCSE Maths',
              courseStartDate: startOfDay('2016-05-18'),
              coursePlannedEndDate: startOfDay('2016-12-23'),
              courseStatus: 'TEMPORARILY_WITHDRAWN',
              grade: 'No achievement',
              isAccredited: true,
              prisonId: 'WDI',
              prisonName: 'Wakefield (HMP)',
              withdrawalReason: 'Significant ill health causing them to be unable to attend education',
              source: 'CURIOUS',
            },
          ],
        },
        coursesCompletedInLast12Months: [
          {
            courseCode: '008WOOD06',
            courseCompletionDate: sub(startOfToday(), { months: 3 }),
            courseName: 'City & Guilds Wood Working',
            courseStartDate: startOfDay('2021-06-01'),
            coursePlannedEndDate: startOfDay('2021-08-06'),
            courseStatus: 'COMPLETED',
            grade: null,
            isAccredited: false,
            prisonId: 'MDI',
            prisonName: 'Moorland (HMP & YOI)',
            withdrawalReason: null,
            source: 'CURIOUS',
          },
        ],
      }

      // When
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, curiousClientToken, 0)
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })

    it('should get In Prison Courses given there is only 1 page of data in Curious for the prisoner', async () => {
      // Given
      prisonService.getAllPrisonNamesById.mockImplementation(mockAllPrisonNameLookup)

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
              courseStartDate: startOfDay('2021-06-01'),
              coursePlannedEndDate: startOfDay('2021-08-06'),
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              courseStatus: 'IN_PROGRESS',
              courseCompletionDate: null,
              isAccredited: false,
              grade: null,
              withdrawalReason: null,
              source: 'CURIOUS',
            },
          ],
          WITHDRAWN: [
            {
              courseCode: '246674',
              courseName: 'GCSE Maths',
              courseStartDate: startOfDay('2016-05-18'),
              prisonId: 'WDI',
              prisonName: 'Wakefield (HMP)',
              courseStatus: 'WITHDRAWN',
              courseCompletionDate: startOfDay('2016-07-15'),
              coursePlannedEndDate: startOfDay('2016-12-23'),
              isAccredited: true,
              grade: 'No achievement',
              withdrawalReason: 'Significant ill health causing them to be unable to attend education',
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
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, curiousClientToken, 0)
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })

    it('should get In Prison Courses given there are 2 pages of data in Curious for the prisoner', async () => {
      // Given
      prisonService.getAllPrisonNamesById.mockImplementation(mockAllPrisonNameLookup)

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
              courseStartDate: startOfDay('2021-06-01'),
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              courseStatus: 'IN_PROGRESS',
              courseCompletionDate: null,
              coursePlannedEndDate: startOfDay('2021-08-06'),
              isAccredited: false,
              grade: null,
              withdrawalReason: null,
              source: 'CURIOUS',
            },
            {
              courseCode: '008WOOD06',
              courseName: 'City & Guilds Wood Working',
              courseStartDate: startOfDay('2021-06-01'),
              coursePlannedEndDate: startOfDay('2021-08-06'),
              prisonId: 'MDI',
              prisonName: 'Moorland (HMP & YOI)',
              courseStatus: 'IN_PROGRESS',
              courseCompletionDate: null,
              isAccredited: false,
              grade: null,
              withdrawalReason: null,
              source: 'CURIOUS',
            },
          ],
          WITHDRAWN: [
            {
              courseCode: '246674',
              courseName: 'GCSE Maths',
              courseStartDate: startOfDay('2016-05-18'),
              prisonId: 'WDI',
              prisonName: 'Wakefield (HMP)',
              courseStatus: 'WITHDRAWN',
              courseCompletionDate: startOfDay('2016-07-15'),
              coursePlannedEndDate: startOfDay('2016-12-23'),
              isAccredited: true,
              grade: 'No achievement',
              withdrawalReason: 'Significant ill health causing them to be unable to attend education',
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
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, curiousClientToken, 0)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, curiousClientToken, 1)
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })

    it('should not get In Prison Courses given the curious API request for page 1 returns an error response', async () => {
      // Given
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
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, curiousClientToken, 0)
      expect(prisonService.getAllPrisonNamesById).not.toHaveBeenCalled()
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })

    it('should not get In Prison Courses given the Curious API request for page 2 returns an error response', async () => {
      // Given
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
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, curiousClientToken, 0)
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, curiousClientToken, 1)
      expect(prisonService.getAllPrisonNamesById).not.toHaveBeenCalled()
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })

    it('should handle retrieval of In Prison Courses given Curious API client returns null indicating not found error for the learner education', async () => {
      // Given
      curiousClient.getLearnerEducationPage.mockResolvedValue(null)

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
      expect(curiousClient.getLearnerEducationPage).toHaveBeenCalledWith(prisonNumber, curiousClientToken, 0)
      expect(hmppsAuthClient.getCuriousClientToken).toHaveBeenCalled()
    })
  })
})
