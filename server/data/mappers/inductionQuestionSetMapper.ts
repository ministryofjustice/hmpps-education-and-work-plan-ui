import type { InductionResponse } from 'educationAndWorkPlanApiClient'

/**
 * Given a [InductionResponse] returns 'LONG_QUESTION_SET' or 'SHORT_QUESTION_SET'
 */
const toInductionQuestionSet = (
  induction: InductionResponse,
): 'LONG_QUESTION_SET' | 'SHORT_QUESTION_SET' | undefined => {
  if (!induction?.workOnRelease?.hopingToWork) {
    return undefined
  }
  return induction.workOnRelease.hopingToWork === 'YES' ? 'LONG_QUESTION_SET' : 'SHORT_QUESTION_SET'
}

export default toInductionQuestionSet
