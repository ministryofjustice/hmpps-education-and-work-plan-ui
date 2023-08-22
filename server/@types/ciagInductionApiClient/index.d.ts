declare module 'ciagInductionApiClient' {
  import { components } from '../ciagInductionApi'

  export type CiagInduction = components['schemas']['CIAGProfileDTO']
  export type CiagWorkExperience = components['schemas']['WorkExperience']
}
