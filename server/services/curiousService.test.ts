import { startOfDay } from 'date-fns'
import type { FunctionalSkills, InPrisonCourseRecords, PrisonerSupportNeeds } from 'viewModels'
import CuriousClient from '../data/curiousClient'
import CuriousService from './curiousService'
import aValidLearnerProfile from '../testsupport/learnerProfileTestDataBuilder'
import {
  aLearnerLatestAssessmentV1DTO,
  aLearnerLddInfoExternalV1DTO,
  anAllAssessmentDTO,
} from '../testsupport/curiousAssessmentsTestDataBuilder'
import { anAllQualificationsDTO } from '../testsupport/curiousQualificationsTestDataBuilder'

jest.mock('../data/curiousClient')
jest.mock('../data/hmppsAuthClient')

describe('curiousService', () => {
  const curiousClient = new CuriousClient(null) as jest.Mocked<CuriousClient>
  const curiousService = new CuriousService(curiousClient)

  const prisonNumber = 'A1234BC'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getPrisonerSupportNeeds', () => {
    it('should get prisoner support needs given a known prison number', async () => {
      // Given
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            prisonNumber: 'G6123VU',
            lddAssessments: [
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'MDI',
                rapidAssessmentDate: '2022-02-18',
                inDepthAssessmentDate: '2022-02-18',
                lddPrimaryName: 'Visual impairment',
                lddSecondaryNames: ['Hearing impairment'],
              }),
            ],
          }),
        ],
      })
      curiousClient.getAssessmentsByPrisonNumber.mockResolvedValue(allAssessments)

      const expectedSupportNeeds: PrisonerSupportNeeds = {
        lddAssessments: [
          {
            prisonId: 'MDI',
            rapidAssessmentDate: startOfDay('2022-02-18'),
            inDepthAssessmentDate: startOfDay('2022-02-18'),
            primaryLddAndHealthNeeds: 'Visual impairment',
            additionalLddAndHealthNeeds: ['Hearing impairment'],
            hasSupportNeeds: true,
          },
        ],
      }

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber)

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
    })

    it('should rethrow error given Curious returns an error for the assessments', async () => {
      // Given
      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getAssessmentsByPrisonNumber.mockRejectedValue(curiousApiError)

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber).catch(error => error)

      // Then
      expect(actual).toEqual(curiousApiError)
      expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
    })

    it('should handle retrieval of prisoner support needs given Curious API client returns null indicating not found error for the prisoner assessments', async () => {
      // Given
      curiousClient.getAssessmentsByPrisonNumber.mockResolvedValue(null)

      const expectedSupportNeeds: PrisonerSupportNeeds = {
        lddAssessments: [],
      }

      // When
      const actual = await curiousService.getPrisonerSupportNeeds(prisonNumber)

      // Then
      expect(actual).toEqual(expectedSupportNeeds)
      expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
    })
  })

  describe('getPrisonerFunctionalSkills', () => {
    it('should get prisoner functional skills given a known prison number', async () => {
      // Given
      const learnerProfiles = [aValidLearnerProfile()]
      curiousClient.getLearnerProfile.mockResolvedValue(learnerProfiles)

      const expectedFunctionalSkills: FunctionalSkills = {
        assessments: [
          {
            assessmentDate: startOfDay('2012-02-16'),
            grade: 'Level 1',
            prisonId: 'MDI',
            type: 'ENGLISH',
          },
        ],
      }

      // When
      const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber)

      // Then
      expect(actual).toEqual(expectedFunctionalSkills)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber)
    })

    it('should handle retrieval of prisoner functional skills given Curious client returns null indicating not found error for the learner profile', async () => {
      // Given
      curiousClient.getLearnerProfile.mockResolvedValue(null)

      const expectedFunctionalSkills: FunctionalSkills = {
        assessments: [],
      }

      // When
      const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber)

      // Then
      expect(actual).toEqual(expectedFunctionalSkills)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber)
    })

    it('should rethrow error given Curious API returns an unexpected error', async () => {
      // Given
      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getLearnerProfile.mockRejectedValue(curiousApiError)

      // When
      const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber).catch(error => error)

      // Then
      expect(actual).toEqual(curiousApiError)
      expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber)
    })
  })

  describe('getPrisonerInPrisonCourses', () => {
    it('should get In Prison Courses', async () => {
      // Given
      const allPrisonerQualifications = anAllQualificationsDTO()
      curiousClient.getQualificationsByPrisonNumber.mockResolvedValue(allPrisonerQualifications)

      const expected: InPrisonCourseRecords = {
        totalRecords: 1,
        coursesByStatus: {
          COMPLETED: [
            {
              courseCode: '101448',
              courseCompletionDate: startOfDay('2024-01-24'),
              courseName: 'Certificate of Management',
              courseStartDate: startOfDay('2023-10-13'),
              courseStatus: 'COMPLETED',
              coursePlannedEndDate: startOfDay('2023-12-29'),
              grade: 'Achieved',
              isAccredited: true,
              prisonId: 'BXI',
              withdrawalReason: null,
              source: 'CURIOUS',
            },
          ],
          IN_PROGRESS: [],
          WITHDRAWN: [],
          TEMPORARILY_WITHDRAWN: [],
        },
        coursesCompletedInLast12Months: [],
        hasCoursesCompletedMoreThan12MonthsAgo: expect.any(Function),
        hasWithdrawnOrInProgressCourses: expect.any(Function),
      }

      // When
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getQualificationsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
    })

    it('should rethrow error given the curious API returns an error response', async () => {
      // Given
      const curiousApiError = {
        message: 'Internal Server Error',
        status: 500,
        text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
      }
      curiousClient.getQualificationsByPrisonNumber.mockRejectedValue(curiousApiError)

      // When
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber).catch(error => error)

      // Then
      expect(actual).toEqual(curiousApiError)
      expect(curiousClient.getQualificationsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
    })

    it('should handle retrieval of In Prison Courses given Curious API client returns null indicating not found error for the learner education', async () => {
      // Given
      curiousClient.getQualificationsByPrisonNumber.mockResolvedValue(null)

      const expected: InPrisonCourseRecords = {
        totalRecords: 0,
        coursesByStatus: {
          COMPLETED: [],
          IN_PROGRESS: [],
          WITHDRAWN: [],
          TEMPORARILY_WITHDRAWN: [],
        },
        coursesCompletedInLast12Months: [],
        hasCoursesCompletedMoreThan12MonthsAgo: expect.any(Function),
        hasWithdrawnOrInProgressCourses: expect.any(Function),
      }

      // When
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getQualificationsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
    })
  })
})
