export default function formatAbilityToWorkConstraintFilter(value: string): string {
  const abilityToWorkConstraintValue =
    AbilityToWorkConstraintValues[value as keyof typeof AbilityToWorkConstraintValues]
  return abilityToWorkConstraintValue
}

enum AbilityToWorkConstraintValues {
  LIMITED_BY_OFFENSE = 'Feels type of offence will limit their ability to find work',
  CARING_RESPONSIBILITIES = 'Has caring responsibilities',
  HEALTH_ISSUES = 'May need work adjustments due to a health condition',
  NO_RIGHT_TO_WORK = 'Right to work in the UK not confirmed',
  OTHER = 'Other',
  NONE = 'None',
}
