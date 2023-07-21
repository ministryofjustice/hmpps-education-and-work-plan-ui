export default function formatFunctionalSkillType(value: string): string {
  const assessmentType = AssessmentType[value as keyof typeof AssessmentType]
  return assessmentType
}

enum AssessmentType {
  ENGLISH = 'English skills',
  MATHS = 'Maths skills',
  DIGITAL_LITERACY = 'Digital skills',
}
