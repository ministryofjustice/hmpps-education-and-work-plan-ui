import type { CiagInduction } from 'ciagInductionApiClient'
import type { OtherQualifications } from 'viewModels'

const toOtherQualifications = (ciagInduction: CiagInduction): OtherQualifications => {
  if (!ciagInduction || !ciagInduction.qualificationsAndTraining) {
    return { problemRetrievingData: false, highestEducationLevel: undefined, additionalTraining: undefined }
  }

  return {
    problemRetrievingData: false,
    highestEducationLevel: ciagInduction.qualificationsAndTraining.educationLevel,
    additionalTraining: ciagInduction.qualificationsAndTraining.additionalTraining,
  }
}

export default toOtherQualifications
