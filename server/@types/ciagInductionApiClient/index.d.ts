declare module 'ciagInductionApiClient' {
  import { components } from '../ciagInductionApi'

  export type CiagInduction = components['schemas']['CIAGProfileDTO']
  export type CiagWorkExperience = components['schemas']['WorkExperience']
  export type CiagWorkInterestDetail = components['schemas']['WorkInterestDetail']

  export type CiagInductionListRequest = components['schemas']['CIAGProfileOffenderIdListRequestDTO']
  export type CiagInductionListResponse = components['schemas']['CIAGProfileListDTO']

  export type CiagPrePrisonQualification = components['schemas']['AchievedQualification']
}
