import { startOfDay } from 'date-fns'
import type { Assessment, InPrisonCourse, CuriousAlnAndLddAssessments } from 'viewModels'
import CuriousClient from '../data/curiousClient'
import CuriousService from './curiousService'
import aValidLearnerProfile from '../testsupport/learnerProfileTestDataBuilder'
import {
  aLearnerAssessmentV2DTO,
  aLearnerLatestAssessmentV1DTO,
  aLearnerLddInfoExternalV1DTO,
  aMathsFunctionalSkillsLearnerAssessmentsDTO,
  anAllAssessmentDTO,
  anAlnLearnerAssessmentsDTO,
  anExternalAssessmentsDTO,
} from '../testsupport/curiousAssessmentsTestDataBuilder'
import { anAllQualificationsDTO } from '../testsupport/curiousQualificationsTestDataBuilder'
import { aValidCurious1Assessment, aValidCurious2Assessment } from '../testsupport/assessmentTestDataBuilder'
import { aValidInPrisonCourse } from '../testsupport/inPrisonCourseTestDataBuilder'
import AssessmentTypeValue from '../enums/assessmentTypeValue'
import {
  aLddAssessment,
  anAlnAssessment,
  validCuriousAlnAndLddAssessments,
} from '../testsupport/curiousAlnAndLddAssessmentsTestDataBuilder'
import AlnAssessmentReferral from '../enums/alnAssessmentReferral'

jest.mock('../data/curiousClient')

describe('curiousService', () => {
  const curiousClient = new CuriousClient(null) as jest.Mocked<CuriousClient>
  const curiousService = new CuriousService(curiousClient)

  const username = 'A-DPS-USER'
  const prisonNumber = 'A1234BC'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getAlnAndLddAssessments', () => {
    it('should get ALN and LDD assessments given a known prison number', async () => {
      // Given
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            lddAssessments: [
              aLearnerLddInfoExternalV1DTO({
                prisonId: 'MDI',
                lddPrimaryName: 'Visual impairment',
                lddSecondaryNames: [
                  'Hearing impairment',
                  'Mental health difficulty',
                  'Social and emotional difficulties',
                ],
                inDepthAssessmentDate: '2013-02-16',
                rapidAssessmentDate: '2012-02-16',
              }),
            ],
          }),
        ],
        v2Assessments: aLearnerAssessmentV2DTO({
          assessments: anExternalAssessmentsDTO({
            alnAssessments: [
              anAlnLearnerAssessmentsDTO({
                prisonId: 'MDI',
                assessmentDate: '2025-10-01',
                assessmentOutcome: 'Yes',
                hasPrisonerConsent: 'Yes',
                stakeholderReferral: 'Education Specialist',
              }),
            ],
          }),
        }),
      })
      curiousClient.getAssessmentsByPrisonNumber.mockResolvedValue(allAssessments)

      const expectedAssessments = validCuriousAlnAndLddAssessments({
        lddAssessments: [
          aLddAssessment({
            prisonId: 'MDI',
            rapidAssessmentDate: startOfDay('2012-02-16'),
            inDepthAssessmentDate: startOfDay('2013-02-16'),
            primaryLddAndHealthNeed: 'Visual impairment',
            additionalLddAndHealthNeeds: [
              'Hearing impairment',
              'Mental health difficulty',
              'Social and emotional difficulties',
            ],
          }),
        ],
        alnAssessments: [
          anAlnAssessment({
            prisonId: 'MDI',
            assessmentDate: startOfDay('2025-10-01'),
            referral: [AlnAssessmentReferral.EDUCATION_SPECIALIST],
          }),
        ],
      })

      // When
      const actual = await curiousService.getAlnAndLddAssessments(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedAssessments)
      expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
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
      const actual = await curiousService.getAlnAndLddAssessments(prisonNumber, username).catch(error => error)

      // Then
      expect(actual).toEqual(curiousApiError)
      expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should handle retrieval of ALN and LDD assessments given Curious API client returns null indicating not found error for the prisoner assessments', async () => {
      // Given
      curiousClient.getAssessmentsByPrisonNumber.mockResolvedValue(null)

      const expectedAssessments: CuriousAlnAndLddAssessments = {
        lddAssessments: [],
        alnAssessments: [],
      }

      // When
      const actual = await curiousService.getAlnAndLddAssessments(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedAssessments)
      expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
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
        const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, username, {
          useCurious1ApiForFunctionalSkills: true,
        })

        // Then
        expect(actual).toEqual(expectedFunctionalSkills)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
        expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, username)
      })

      it('should handle retrieval of prisoner functional skills given Curious client returns null indicating not found error for the learner profile', async () => {
        // Given
        curiousClient.getLearnerProfile.mockResolvedValue(null)

        const expectedFunctionalSkills = {
          assessments: [] as Array<Assessment>,
        }

        // When
        const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, username, {
          useCurious1ApiForFunctionalSkills: true,
        })

        // Then
        expect(actual).toEqual(expectedFunctionalSkills)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
        expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, username)
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
          .getPrisonerFunctionalSkills(prisonNumber, username, { useCurious1ApiForFunctionalSkills: true })
          .catch(error => error)

        // Then
        expect(actual).toEqual(curiousApiError)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
        expect(curiousClient.getLearnerProfile).toHaveBeenCalledWith(prisonNumber, username)
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
              referral: [AlnAssessmentReferral.EDUCATION_SPECIALIST],
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
        const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, username)

        // Then
        expect(actual).toEqual(expectedFunctionalSkills)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
        expect(curiousClient.getLearnerProfile).not.toHaveBeenCalled()
      })

      it('should handle retrieval of prisoner functional skills given Curious client returns null indicating not found error for the assessments', async () => {
        // Given
        curiousClient.getAssessmentsByPrisonNumber.mockResolvedValue(null)

        const expectedFunctionalSkills = {
          assessments: [] as Array<Assessment>,
        }

        // When
        const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, username)

        // Then
        expect(actual).toEqual(expectedFunctionalSkills)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
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
        const actual = await curiousService.getPrisonerFunctionalSkills(prisonNumber, username).catch(error => error)

        // Then
        expect(actual).toEqual(curiousApiError)
        expect(curiousClient.getAssessmentsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
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
        totalRecords: 2,
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
          IN_PROGRESS: [
            aValidInPrisonCourse({
              prisonId: 'BXI',
              courseCode: '270828',
              courseName: 'CIMA Strategic Level',
              courseStartDate: startOfDay('2024-06-01'),
              courseStatus: 'IN_PROGRESS',
              courseCompletionDate: null,
              coursePlannedEndDate: startOfDay('2024-06-30'),
              isAccredited: true,
              grade: null,
              withdrawalReason: null,
              source: 'CURIOUS2',
            }),
          ],
          WITHDRAWN: [] as Array<InPrisonCourse>,
          TEMPORARILY_WITHDRAWN: [] as Array<InPrisonCourse>,
        },
        coursesCompletedInLast12Months: [] as Array<InPrisonCourse>,
        hasCoursesCompletedMoreThan12MonthsAgo: expect.any(Function),
        hasWithdrawnOrInProgressCourses: expect.any(Function),
      }

      // When
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getQualificationsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
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
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber, username).catch(error => error)

      // Then
      expect(actual).toEqual(curiousApiError)
      expect(curiousClient.getQualificationsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
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
      const actual = await curiousService.getPrisonerInPrisonCourses(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(curiousClient.getQualificationsByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    })
  })
})
