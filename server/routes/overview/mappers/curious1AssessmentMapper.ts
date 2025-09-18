/**
 * Functions that map Curious 1 assessment DTOs from the Curious APIs to instances of Assessment
 *
 * Curious assessments that are stored in Curious 1 are Functional Skills assessments, and are assessments of English,
 * Maths and Digital skills.
 *
 * Curious assessments that are stored in Curious 1 are returned by 2 APIs:
 *  - /learnerProfile which returns an array of LearnerProfile
 *      This is colloquially known as the Curious 1 API
 *  - /learnerAssessments/v2 which returns an instance of AllAssessmentDTO which in turn contains an array of LearnerAssessmentV1DTO
 *      This is colloquially known as the Curious 2 API, though a better name would be the v2 API, as the API itself is not coupled to
 *      a version of Curious, and in this context is returning data from both Curious 1 and Curious 2
 */

import { startOfDay } from 'date-fns'
import type {
  AllAssessmentDTO,
  AssessmentDTO,
  LearnerAssessmentV1DTO,
  LearnerLatestAssessmentV1DTO,
  LearnerProfile,
} from 'curiousApiClient'
import type { Assessment } from 'viewModels'
import AssessmentTypeValue from '../../../enums/assessmentTypeValue'

/**
 * Map the Curious 1 assessments within AllAssessmentDTO to an array of Assessment
 */
const toCurious1AssessmentsFromAllAssessmentDTO = (allAssessments: AllAssessmentDTO): Array<Assessment> =>
  (allAssessments?.v1 || [])
    .flatMap((assessment: LearnerLatestAssessmentV1DTO) => assessment.qualifications || [])
    .filter((v1LearnerAssessment: LearnerAssessmentV1DTO) => v1LearnerAssessment.qualification != null)
    .map(toAssessmentFromLearnerAssessmentV1DTO)

/**
 * Map the Curious 1 assessments within an array of LearnerProfile to an array of Assessment
 */
const toCurious1AssessmentsFromLearnerProfiles = (learnerProfiles: Array<LearnerProfile>): Array<Assessment> =>
  (learnerProfiles || []).flatMap((learnerProfile: LearnerProfile) =>
    learnerProfile.qualifications.map((assessmentDTO: AssessmentDTO) =>
      toAssessmentFromAssessmentDTO(assessmentDTO, learnerProfile.establishmentId),
    ),
  )

/**
 * Maps a single Curious 1 assessment LearnerAssessmentV1DTO into an Assessment
 */
const toAssessmentFromLearnerAssessmentV1DTO = (v1LearnerAssessment: LearnerAssessmentV1DTO): Assessment => ({
  prisonId: v1LearnerAssessment.establishmentId,
  type: toAssessmentType(v1LearnerAssessment.qualification.qualificationType),
  assessmentDate: startOfDay(v1LearnerAssessment.qualification.assessmentDate),
  level: v1LearnerAssessment.qualification.qualificationGrade,
  levelBanding: null,
  referral: null,
  nextStep: null,
  source: 'CURIOUS1',
})

/**
 * Maps a single Curious 1 assessment AssessmentDTO into an Assessment
 */
const toAssessmentFromAssessmentDTO = (assessment: AssessmentDTO, prisonId: string): Assessment => ({
  prisonId,
  type: toAssessmentType(assessment.qualificationType),
  assessmentDate: startOfDay(assessment.assessmentDate),
  level: assessment.qualificationGrade,
  levelBanding: null,
  referral: null,
  nextStep: null,
  source: 'CURIOUS1',
})

const toAssessmentType = (qualificationType: string): AssessmentTypeValue => {
  switch (qualificationType) {
    case 'English': {
      return AssessmentTypeValue.ENGLISH
    }
    case 'Maths': {
      return AssessmentTypeValue.MATHS
    }
    case 'Digital Literacy': {
      return AssessmentTypeValue.DIGITAL_LITERACY
    }
    default: {
      return undefined
    }
  }
}

export { toCurious1AssessmentsFromAllAssessmentDTO, toCurious1AssessmentsFromLearnerProfiles }
