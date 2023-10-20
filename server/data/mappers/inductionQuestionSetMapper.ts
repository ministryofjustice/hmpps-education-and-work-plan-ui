import type { CiagInduction } from 'ciagInductionApiClient'

const toInductionQuestionSet = (
  ciagInduction: CiagInduction,
): 'LONG_QUESTION_SET' | 'SHORT_QUESTION_SET' | undefined => {
  if (ciagInduction) {
    return ciagInduction.hopingToGetWork === 'YES' ? 'LONG_QUESTION_SET' : 'SHORT_QUESTION_SET'
  }
  return undefined
}

export default toInductionQuestionSet
