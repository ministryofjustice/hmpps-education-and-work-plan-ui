declare module 'curiousApiClient' {
  import { components } from '../curiousApi'

  export type Assessment = components['schemas']['AssessmentDTO']
  export type LearnerEducation = components['schemas']['LearnerEducationDTO']
  export type LearnerNeurodivergence = components['schemas']['LearnerNeurodivergenceDTO']
  export type LearnerProfile = components['schemas']['LearnerProfileDTO']
}
