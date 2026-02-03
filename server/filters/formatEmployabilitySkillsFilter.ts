import EmployabilitySkillsValue from '../enums/employabilitySkillsValue'

const employabilitySkillsScreenValues: Record<EmployabilitySkillsValue, string> = {
  ADAPTABILITY: 'Adaptability',
  COMMUNICATION: 'Communication',
  CREATIVITY: 'Creativity',
  INITIATIVE: 'Initiative',
  ORGANISATION: 'Organisation',
  PLANNING: 'Planning',
  PROBLEM_SOLVING: 'Problem solving',
  RELIABILITY: 'Reliability',
  TEAMWORK: 'Teamwork',
  TIMEKEEPING: 'Timekeeping',
}

export default function formatEmployabilitySkillsFilter(value: EmployabilitySkillsValue): string {
  return employabilitySkillsScreenValues[value]
}
