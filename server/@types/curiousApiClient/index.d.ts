declare module 'curiousApiClient' {
  import { components } from '../curiousApi'

  // Data types for the Curious V1 endpoints
  // ---------------------------------------
  export type AssessmentDTO = components['schemas']['AssessmentDTO']
  export type LearnerProfile = components['schemas']['LearnerProfileDTO']

  // Curious V1 Course & Qualifications Types
  export type LearnerEducationDTO = components['schemas']['LearnerEducationDTO']

  // Curious V1 Assessment Types
  export type LearnerLatestAssessmentV1DTO = components['schemas']['LearnerLatestAssessmentV1DTO']
  export type LearnerAssessmentV1DTO = components['schemas']['LearnerAssessmentV1DTO']
  export type LearnerLddInfoExternalV1DTO = components['schemas']['LearnerLddInfoExternalV1DTO']

  // Data types for the Curious V2 endpoints
  // ---------------------------------------

  // Curious V2 Assessment Types
  export type AllAssessmentDTO = components['schemas']['AllAssessmentDTO']
  export type LearnerAssessmentV2DTO = components['schemas']['LearnerAssessmentV2DTO']
  export type ExternalAssessmentsDTO = components['schemas']['ExternalAssessmentsDTO']
  export type LearnerAssessmentsDTO = components['schemas']['LearnerAssessmentsDTO']
  export type LearnerAssessmentsFunctionalSkillsDTO = components['schemas']['LearnerAssessmentsFunctionalSkillsDTO']
  export type LearnerAssessmentsAlnDTO = components['schemas']['LearnerAssessmentsAlnDTO']

  // Curious V2 Course & Qualifications Types
  export type AllQualificationsDTO = components['schemas']['AllQualificationsDTO']
  export type LearnerQualificationsDTO = components['schemas']['LearnerQualificationsDTO']
}
