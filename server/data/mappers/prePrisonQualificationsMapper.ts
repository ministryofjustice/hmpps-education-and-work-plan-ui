import type { CiagInduction } from 'ciagInductionApiClient'
import type { PrePrisonQualifications } from 'viewModels'

const toPrePrisonQualifications = (ciagInduction: CiagInduction): PrePrisonQualifications => {
  if (!ciagInduction || !ciagInduction.qualificationsAndTraining) {
    return { problemRetrievingData: false, highestEducationLevel: undefined, additionalTraining: undefined }
  }

  return {
    problemRetrievingData: false,
    highestEducationLevel: ciagInduction.qualificationsAndTraining.educationLevel,
    additionalTraining: ciagInduction.qualificationsAndTraining.additionalTraining,
  }
}

export default toPrePrisonQualifications
