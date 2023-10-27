export default function formatInPrisonEducationFilter(value: string): string {
  const inPrisonEductionValue = InPrisonEductionValues[value as keyof typeof InPrisonEductionValues]
  return inPrisonEductionValue
}

enum InPrisonEductionValues {
  BARBERING_AND_HAIRDRESSING = 'Barbering and hairdressing',
  CATERING = 'Catering',
  COMMUNICATION_SKILLS = 'Communication skills',
  ENGLISH_LANGUAGE_SKILLS = 'English language skills',
  FORKLIFT_DRIVING = 'Forklift driving',
  INTERVIEW_SKILLS = 'Interview skills',
  MACHINERY_TICKETS = 'Machinery tickets',
  NUMERACY_SKILLS = 'Numeracy skills',
  RUNNING_A_BUSINESS = 'Running a business',
  SOCIAL_AND_LIFE_SKILLS = 'Social and life skills',
  WELDING_AND_METALWORK = 'Welding and metalwork',
  WOODWORK_AND_JOINERY = 'Woodwork and joinery',
  OTHER = 'Other',
}
