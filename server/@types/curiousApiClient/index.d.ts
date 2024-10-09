declare module 'curiousApiClient' {
  import { components } from '../curiousApi'

  export type Assessment = components['schemas']['AssessmentDTO']
  export type LearnerProfile = components['schemas']['LearnerProfileDTO']

  export type LearnerEductionPagedResponse = components['schemas']['Page']
  export type LearnerEducation = components['schemas']['LearnerEducationDTO']
}
