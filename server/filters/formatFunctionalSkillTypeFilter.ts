import AssessmentTypeValue from '../enums/assessmentTypeValue'

const assessmentTypeScreenValues: Record<AssessmentTypeValue, string> = {
  ENGLISH: 'English skills',
  MATHS: 'Maths skills',
  DIGITAL_LITERACY: 'Digital skills',
  READING: 'Reading',
  ESOL: 'ESOL',
}

const formatFunctionalSkillTypeFilter = (value: AssessmentTypeValue): string => assessmentTypeScreenValues[value]

export default formatFunctionalSkillTypeFilter
