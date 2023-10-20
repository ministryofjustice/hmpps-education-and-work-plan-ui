import type { CiagInduction } from 'ciagInductionApiClient'
import type { OtherQualifications } from 'viewModels'
import toInductionQuestionSet from './inductionQuestionSetMapper'

const toOtherQualifications = (ciagInduction: CiagInduction): OtherQualifications => {
  if (!ciagInduction || !ciagInduction.qualificationsAndTraining) {
    return {
      problemRetrievingData: false,
      inductionQuestionSet: toInductionQuestionSet(ciagInduction),
      highestEducationLevel: undefined,
      additionalTraining: undefined,
    }
  }

  return {
    problemRetrievingData: false,
    inductionQuestionSet: toInductionQuestionSet(ciagInduction),
    highestEducationLevel: ciagInduction.qualificationsAndTraining.educationLevel,
    additionalTraining: ciagInduction.qualificationsAndTraining.additionalTraining,
  }
}

export default toOtherQualifications
