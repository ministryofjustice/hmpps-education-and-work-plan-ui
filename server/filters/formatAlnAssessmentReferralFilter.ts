import AlnAssessmentReferral from '../enums/alnAssessmentReferral'

const alnAssessmentReferralScreenValues: Record<AlnAssessmentReferral, string> = {
  EDUCATION_SPECIALIST: 'Education Specialist',
  HEALTHCARE: 'Healthcare',
  NSM: 'NSM',
  OTHER: 'Other',
  PSYCHOLOGY: 'Psychology',
  SAFER_CUSTODY: 'Safer Custody',
  SUBSTANCE_MISUSE_TEAM: 'Substance Misuse Team',
}

const formatAlnAssessmentReferralScreenValueFilter = (value: AlnAssessmentReferral): string =>
  alnAssessmentReferralScreenValues[value]

export default formatAlnAssessmentReferralScreenValueFilter
