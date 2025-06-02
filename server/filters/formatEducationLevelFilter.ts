export default function formatEducationLevelFilter(value: string): string {
  const highestLevelOfEducationValue =
    HighestLevelOfEducationValues[value as keyof typeof HighestLevelOfEducationValues]
  return highestLevelOfEducationValue
}

enum HighestLevelOfEducationValues {
  PRIMARY_SCHOOL = 'Primary school',
  SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS = 'Secondary school, left before taking exams',
  SECONDARY_SCHOOL_TOOK_EXAMS = 'Secondary school, took exams',
  FURTHER_EDUCATION_COLLEGE = 'Further education college',
  UNDERGRADUATE_DEGREE_AT_UNIVERSITY = 'Undergraduate degree at university',
  POSTGRADUATE_DEGREE_AT_UNIVERSITY = 'Postgraduate degree at university',
  NO_FORMAL_EDUCATION = 'No formal education',
  NOT_SURE = 'Not sure',
}
