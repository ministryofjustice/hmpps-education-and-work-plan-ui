export default function formatAbilityToWorkConstraintFilter(value: string): string {
  const abilityToWorkConstraintValue =
    AbilityToWorkConstraintValues[value as keyof typeof AbilityToWorkConstraintValues]
  return abilityToWorkConstraintValue
}

enum AbilityToWorkConstraintValues {
  LIMITED_BY_OFFENCE = 'Feels type of offence will limit their ability to find work',
  CARING_RESPONSIBILITIES = 'Has caring responsibilities',
  NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH = 'May need work adjustments due to a health condition',
  UNABLE_TO_WORK_DUE_TO_HEALTH = 'Not able to work due to a health condition',
  LACKS_CONFIDENCE_OR_MOTIVATION = 'Lacks confidence or motivation to find work',
  REFUSED_SUPPORT_WITH_NO_REASON = 'Refused support with no reason',
  RETIRED = 'Retired',
  NO_RIGHT_TO_WORK = 'Right to work in the UK not confirmed',
  NOT_SURE = 'Not sure',
  OTHER = 'Other',
  NONE = 'None',
}
