import InductionScheduleStatusValue from './inductionScheduleStatusValue'

export const InductionExemptionReason = [
  InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
  InductionScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
  InductionScheduleStatusValue.EXEMPT_PRISONER_FAILED_TO_ENGAGE,
  InductionScheduleStatusValue.EXEMPT_PRISONER_ESCAPED_OR_ABSCONDED,
  InductionScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES,
  InductionScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES,
  InductionScheduleStatusValue.EXEMPT_PRISON_STAFF_REDEPLOYMENT,
  InductionScheduleStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE,
  InductionScheduleStatusValue.EXEMPT_SECURITY_ISSUE_RISK_TO_STAFF,
  InductionScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
  InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_IN_PROGRESS,
  InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_INCOMPLETE,
] as const

/*
 * The type InductionExemptionReasonValue which is used for the onscreen values/options when setting an exception
 * is a subset of InductionScheduleStatusValue (ie. some values in InductionScheduleStatusValue are not presented/supported
 * by the UI)
 */
type InductionExemptionReasonValue = (typeof InductionExemptionReason)[number]

export default InductionExemptionReasonValue
