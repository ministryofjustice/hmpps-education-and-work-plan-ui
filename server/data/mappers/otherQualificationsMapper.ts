import type { CiagInduction } from 'ciagInductionApiClient'
import type { OtherQualifications } from 'viewModels'

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

const toInductionQuestionSet = (
  ciagInduction: CiagInduction,
): 'LONG_QUESTION_SET' | 'SHORT_QUESTION_SET' | undefined => {
  if (ciagInduction) {
    return ciagInduction.hopingToGetWork === 'YES' ? 'LONG_QUESTION_SET' : 'SHORT_QUESTION_SET'
  }
  return undefined
}

export default toOtherQualifications
