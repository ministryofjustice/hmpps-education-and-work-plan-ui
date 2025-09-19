import { startOfDay } from 'date-fns'
import type { Assessment, InPrisonCourse, PrisonerSupportNeeds } from 'viewModels'
import CuriousClient from '../data/curiousClient'
import CuriousService from './curiousService'
import aValidLearnerProfile from '../testsupport/learnerProfileTestDataBuilder'
import {
  aLearnerAssessmentV2DTO,
  aLearnerLatestAssessmentV1DTO,
  aLearnerLddInfoExternalV1DTO,
  aMathsFunctionalSkillsLearnerAssessmentsDTO,
  anAllAssessmentDTO,
  anExternalAssessmentsDTO,
} from '../testsupport/curiousAssessmentsTestDataBuilder'
import { anAllQualificationsDTO } from '../testsupport/curiousQualificationsTestDataBuilder'
import { aValidCurious1Assessment, aValidCurious2Assessment } from '../testsupport/assessmentTestDataBuilder'
import { aValidInPrisonCourse } from '../testsupport/inPrisonCourseTestDataBuilder'
import AssessmentTypeValue from '../enums/assessmentTypeValue'

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
    describe('get functional skills from data from both Curious 1 and Curious 2 endpoints', () => {
      const allAssessments = anAllAssessmentDTO()
      curiousClient.getAssessmentsByPrisonNumber.mockResolvedValue(allAssessments)

      it('should get prisoner functional skills given a known prison number', async () => {
        // Given
        const learnerProfiles = [aValidLearnerProfile()]
        curiousClient.getLearnerProfile.mockResolvedValue(learnerProfiles)

        // We expect the service to have called the mapper in such a way that it ignores/does not map assessments from the
        // Curious 2 endpoint data. Therefore we expect the returned functional skills to be only those that are in the
        // array of LearnerProfile, which by definition will all be Curious 1 Functional Skills
        const expectedFunctionalSkills = {
          assessments: [
            aValidCurious1Assessment({
              assessmentDate: startOfDay('2012-02-16'),
              level: 'Level 1',
              prisonId: 'MDI',
              type: 'ENGLISH',
            }),
          ],
        }

        // When
        const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, {
          useCurious1ApiForFunctionalSkills: true,
        })

        // Then
        expect(actual).toEqual(expectedFunctionalSkills)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
        expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber)
      })

      it('should handle retrieval of prisoner functional skills given Curious client returns null indicating not found error for the learner profile', async () => {
        // Given
        curiousClient.getLearnerProfile.mockResolvedValue(null)

        const expectedFunctionalSkills = {
          assessments: [] as Array<Assessment>,
        }

        // When
        const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, {
          useCurious1ApiForFunctionalSkills: true,
        })

        // Then
        expect(actual).toEqual(expectedFunctionalSkills)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
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
        const actual = await curiousService
          .getPrisonerFunctionalSkills(prisonNumber, { useCurious1ApiForFunctionalSkills: true })
          .catch(error => error)

        // Then
        expect(actual).toEqual(curiousApiError)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
        expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber)
      })
    })

    describe('get functional skills only from Curious 2 endpoint data', () => {
      it('should get prisoner functional skills given a known prison number', async () => {
        // Given
        const allAssessments = anAllAssessmentDTO({
          v1Assessments: [aLearnerLatestAssessmentV1DTO()],
          v2Assessments: aLearnerAssessmentV2DTO({
            assessments: anExternalAssessmentsDTO({
              englishFunctionalSkills: [],
              mathsFunctionalSkills: [aMathsFunctionalSkillsLearnerAssessmentsDTO()],
              digitalFunctionalSkillsAssessments: [],
              esolAssessments: [],
              readingAssessments: [],
            }),
          }),
        })
        curiousClient.getAssessmentsByPrisonNumber.mockResolvedValue(allAssessments)

        // We expect the returned Functional Skills to be those mapped from the Curious 2 endpoint assessment data.
        // Even though it is a Curious 2 endpoint, it returns both Curious 1 and Curious 2 functional skills, hence we
        // expect both types.
        const expectedFunctionalSkills = {
          assessments: [
            // The Curious 2 Maths assessment
            aValidCurious2Assessment({
              type: AssessmentTypeValue.MATHS,
              assessmentDate: startOfDay('2025-10-01'),
              prisonId: 'MDI',
              level: 'Entry Level 2',
              levelBanding: '2.1',
              nextStep: 'Progress to course at level consistent with assessment result',
              referral: 'Education Specialist',
            }),
            // The Curious 1 English assessment
            aValidCurious1Assessment({
              assessmentDate: startOfDay('2012-02-16'),
              level: 'Level 1',
              prisonId: 'MDI',
              type: 'ENGLISH',
            }),
          ],
        }

        // When
        const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber)

        // Then
        expect(actual).toEqual(expectedFunctionalSkills)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
        expect(curiousClient.getLearnerProfile).not.toHaveBeenCalled()
      })

      it('should handle retrieval of prisoner functional skills given Curious client returns null indicating not found error for the assessments', async () => {
        // Given
        curiousClient.getAssessmentsByPrisonNumber.mockResolvedValue(null)

        const expectedFunctionalSkills = {
          assessments: [] as Array<Assessment>,
        }

        // When
        const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber)

        // Then
        expect(actual).toEqual(expectedFunctionalSkills)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
        expect(curiousClient.getLearnerProfile).not.toHaveBeenCalled()
      })

      it('should rethrow error given Curious API returns an unexpected error', async () => {
        // Given
        const curiousApiError = {
          message: 'Internal Server Error',
          status: 500,
          text: { errorCode: 'VC5000', errorMessage: 'Internal server error', httpStatusCode: 500 },
        }
        curiousClient.getAssessmentsByPrisonNumber.mockRejectedValue(curiousApiError)

        // When
        const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber).catch(error => error)

        // Then
        expect(actual).toEqual(curiousApiError)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber)
        expect(curiousClient.getLearnerProfile).not.toHaveBeenCalled()
      })
    })
  })

  describe('getPrisonerInPrisonCourses', () => {
    it('should get In Prison Courses', async () => {
      // Given
      const allPrisonerQualifications = anAllQualificationsDTO()
      curiousClient.getQualificationsByPrisonNumber.mockResolvedValue(allPrisonerQualifications)

      const expected = {
        totalRecords: 1,
        coursesByStatus: {
          COMPLETED: [
            aValidInPrisonCourse({
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
              source: 'CURIOUS1',
            }),
          ],
          IN_PROGRESS: [] as Array<InPrisonCourse>,
          WITHDRAWN: [] as Array<InPrisonCourse>,
          TEMPORARILY_WITHDRAWN: [] as Array<InPrisonCourse>,
        },
        coursesCompletedInLast12Months: [] as Array<InPrisonCourse>,
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

      const expected = {
        totalRecords: 0,
        coursesByStatus: {
          COMPLETED: [] as Array<InPrisonCourse>,
          IN_PROGRESS: [] as Array<InPrisonCourse>,
          WITHDRAWN: [] as Array<InPrisonCourse>,
          TEMPORARILY_WITHDRAWN: [] as Array<InPrisonCourse>,
        },
        coursesCompletedInLast12Months: [] as Array<InPrisonCourse>,
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
