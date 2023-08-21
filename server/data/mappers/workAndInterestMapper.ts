import type { CiagInduction } from 'ciagInductionApiClient'
import type { WorkAndInterests, WorkAndInterestsData } from 'viewModels'

const toWorkAndInterests = (ciagInduction: CiagInduction): WorkAndInterests => {
  return {
    problemRetrievingData: false,
    data: toWorkAndInterestsData(ciagInduction),
  }
}

const toWorkAndInterestsData = (ciagInduction: CiagInduction): WorkAndInterestsData => {
  if (!ciagInduction) {
    return undefined
  }

  // TODO RR-115 - map the fields
  return { skillsAndInterests: undefined, workExperience: undefined, workInterests: undefined }
}

export default toWorkAndInterests
