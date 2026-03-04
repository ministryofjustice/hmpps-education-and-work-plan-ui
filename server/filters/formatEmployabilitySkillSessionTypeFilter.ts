import EmployabilitySkillSessionType from '../enums/employabilitySkillSessionType'

const employabilitySkillSessionTypeScreenValues: Record<EmployabilitySkillSessionType, string> = {
  CIAG_INDUCTION: 'Careers, information, advice and guidance (CIAG) induction',
  CIAG_REVIEW: 'Careers, information, advice and guidance (CIAG) review',
  EDUCATION_REVIEW: 'Education',
  INDUSTRIES_REVIEW: 'Industries',
}

const formatEmployabilitySkillSessionTypeFilter = (value: EmployabilitySkillSessionType): string =>
  employabilitySkillSessionTypeScreenValues[value]

export default formatEmployabilitySkillSessionTypeFilter
