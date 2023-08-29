export default function formatSkillFilter(value: string): string {
  const skillValue = SkillValues[value as keyof typeof SkillValues]
  return skillValue
}

enum SkillValues {
  COMMUNICATION = 'Communication',
  POSITIVE_ATTITUDE = 'Positive attitude',
  RESILIENCE = 'Resilience',
  SELF_MANAGEMENT = 'Self-management',
  TEAMWORK = 'Teamwork',
  THINKING_AND_PROBLEM_SOLVING = 'Thinking and problem-solving',
  WILLINGNESS_TO_LEARN = 'Willingness to learn',
  OTHER = 'Other',
  NONE = 'None',
}
