import ReviewScheduleStatusValue from './reviewScheduleStatusValue'

/*
 * The type ReviewPlanExemptionReasonValue which is used for the onscreen values/options when setting an exception
 * is a subset of ReviewScheduleStatusValue (ie. some values in ReviewScheduleStatusValue are not presented/supported
 * by the UI)
 */
type ReviewPlanExemptionReasonValue =
  | ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY
  | ReviewScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES
  | ReviewScheduleStatusValue.EXEMPT_PRISONER_FAILED_TO_ENGAGE
  | ReviewScheduleStatusValue.EXEMPT_PRISONER_ESCAPED_OR_ABSCONDED
  | ReviewScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES
  | ReviewScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES
  | ReviewScheduleStatusValue.EXEMPT_PRISON_STAFF_REDEPLOYMENT
  | ReviewScheduleStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE
  | ReviewScheduleStatusValue.EXEMPT_SECURITY_ISSUE_RISK_TO_STAFF
  | ReviewScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE

export default ReviewPlanExemptionReasonValue
