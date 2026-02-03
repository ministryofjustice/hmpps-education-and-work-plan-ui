import EmployabilitySkillRatingValue from '../enums/employabilitySkillRatingValue'

const employabilitySkillRatingScreenValues: Record<EmployabilitySkillRatingValue, string> = {
  NOT_CONFIDENT: '1 - not confident',
  LITTLE_CONFIDENCE: '2 - a little confident',
  QUITE_CONFIDENT: '3 - quite confident',
  VERY_CONFIDENT: '4 - very confident',
}

export default function formatEmployabilitySkillRatingFilter(value: EmployabilitySkillRatingValue): string {
  return employabilitySkillRatingScreenValues[value]
}
