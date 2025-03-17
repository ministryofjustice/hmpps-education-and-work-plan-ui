import ReviewPlanExemptionReasonValue from '../enums/reviewPlanExemptionReasonValue'

export default function formatReviewExemptionReasonFilter(value: ReviewPlanExemptionReasonValue): string {
  const reviewPlanExemptionReasonValue = ReviewExemptionReasonValues[value as keyof typeof ReviewExemptionReasonValues]
  return reviewPlanExemptionReasonValue
}

enum ReviewExemptionReasonValues {
  EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY = `Has a drug or alcohol dependency and is in assessment or treatment`,
  EXEMPT_PRISONER_OTHER_HEALTH_ISSUES = `Has a health concern and is in assessment or treatment`,
  EXEMPT_PRISONER_FAILED_TO_ENGAGE = `Has failed to engage or cooperate for a reason outside contractor's control`,
  EXEMPT_PRISONER_ESCAPED_OR_ABSCONDED = `Has escaped, absconded or failed to return to prison`,
  EXEMPT_PRISON_REGIME_CIRCUMSTANCES = `Prison regime changes or circumstances outside the contractor's control`,
  EXEMPT_PRISONER_SAFETY_ISSUES = `Prisoner safety`,
  EXEMPT_PRISON_STAFF_REDEPLOYMENT = `Prison staff redeployed`,
  EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE = `Prison operational or security reason`,
  EXEMPT_SECURITY_ISSUE_RISK_TO_STAFF = `Security issue that poses risk to staff`,
  EXEMPT_SYSTEM_TECHNICAL_ISSUE = `Review logged late due to technical issue with learning and work plan service`,
}
