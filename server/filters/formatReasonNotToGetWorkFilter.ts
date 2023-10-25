export default function formatReasonNotToGetWorkFilter(value: string): string {
  const reasonNotToGetWorkValue = ReasonNotToGetWorkValues[value as keyof typeof ReasonNotToGetWorkValues]
  return reasonNotToGetWorkValue
}

enum ReasonNotToGetWorkValues {
  LIMIT_THEIR_ABILITY = 'Feels type of offence will limit their ability to find work',
  FULL_TIME_CARER = 'Has full-time caring responsibilities',
  LACKS_CONFIDENCE_OR_MOTIVATION = 'Lacks confidence or motivation to find work',
  HEALTH = 'Not able to work due to a health condition',
  NO_REASON = 'Refused support with no reason',
  RETIRED = 'Retired',
  NO_RIGHT_TO_WORK = 'Right to work in the UK not confirmed',
  OTHER = 'Other',
  NOT_SURE = 'Not sure',
}
