/**
 * Functions that map Curious 2 assessment DTOs from the Curious APIs to instances of Assessment
 *
 * Curious assessments that are stored in Curious 2 cover Functional Skills assessments (English, Digital and Maths),
 * Reading assessments, ESOL assessments, and ALN assessments.
 *
 * The functions exported here map specific types of assessment.
 */

import { startOfDay } from 'date-fns'
import type {
  ExternalAssessmentsDTO,
  LearnerAssessmentsDTO,
  LearnerAssessmentsFunctionalSkillsDTO,
} from 'curiousApiClient'
import type { Assessment } from 'viewModels'
import AssessmentTypeValue from '../../../enums/assessmentTypeValue'

/**
 * Maps the Functional Skills LearnerAssessmentsFunctionalSkillsDTO (specifically those of type English, Maths and Digital) from the ExternalAssessmentsDTO into an array of Assessment
 */
const toCurious2FunctionalSkillsAssessments = (externalAssessmentsDTO: ExternalAssessmentsDTO): Array<Assessment> =>
  [] //
    .concat(
      (externalAssessmentsDTO?.englishFunctionalSkills || []).map(
        (assessment: LearnerAssessmentsFunctionalSkillsDTO) => ({
          ...toBasicAssessment(assessment),
          level: assessment.workingTowardsLevel,
          levelBanding: assessment.levelBranding,
          type: AssessmentTypeValue.ENGLISH,
        }),
      ),
    )
    .concat(
      (externalAssessmentsDTO?.mathsFunctionalSkills || []).map(
        (assessment: LearnerAssessmentsFunctionalSkillsDTO) => ({
          ...toBasicAssessment(assessment),
          level: assessment.workingTowardsLevel,
          levelBanding: assessment.levelBranding,
          type: AssessmentTypeValue.MATHS,
        }),
      ),
    )
    .concat(
      (externalAssessmentsDTO?.digitalSkillsFunctionalSkills || []).map(
        (assessment: LearnerAssessmentsFunctionalSkillsDTO) => ({
          ...toBasicAssessment(assessment),
          level: assessment.workingTowardsLevel,
          levelBanding: assessment.levelBranding,
          type: AssessmentTypeValue.DIGITAL_LITERACY,
        }),
      ),
    )

/**
 * Maps the LearnerAssessmentsDTOs of type Reading from the ExternalAssessmentsDTO into an array of Assessment
 */
const toCurious2ReadingAssessments = (externalAssessmentsDTO: ExternalAssessmentsDTO): Array<Assessment> =>
  (externalAssessmentsDTO?.reading || []).map((assessment: LearnerAssessmentsDTO) => ({
    ...toBasicAssessment(assessment),
    level: assessment.assessmentOutcome,
    levelBanding: null as string,
    type: AssessmentTypeValue.READING,
  }))

/**
 * Maps the LearnerAssessmentsDTOs of type ESOL from the ExternalAssessmentsDTO into an array of Assessment
 */
const toCurious2ESOLAssessments = (externalAssessmentsDTO: ExternalAssessmentsDTO): Array<Assessment> =>
  (externalAssessmentsDTO?.esol || []).map((assessment: LearnerAssessmentsDTO) => ({
    ...toBasicAssessment(assessment),
    level: assessment.assessmentOutcome,
    levelBanding: null as string,
    type: AssessmentTypeValue.ESOL,
  }))

const toBasicAssessment = (assessment: LearnerAssessmentsFunctionalSkillsDTO | LearnerAssessmentsDTO): Assessment =>
  ({
    prisonId: assessment.establishmentId,
    assessmentDate: startOfDay(assessment.assessmentDate),
    referral: assessment.stakeholderReferral,
    nextStep: assessment.assessmentNextStep,
    source: 'CURIOUS2',
  }) as Assessment

export { toCurious2FunctionalSkillsAssessments, toCurious2ReadingAssessments, toCurious2ESOLAssessments }
