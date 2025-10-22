import StrengthCategory from '../enums/strengthCategory'

const strengthCategoryScreenValues: Record<StrengthCategory, string> = {
  SENSORY: 'Sensory',
  EMOTIONS_FEELINGS: 'Emotions and feelings',
  PHYSICAL_SKILLS: 'Physical skills and coordination',
  LITERACY_SKILLS: 'Literacy skills',
  NUMERACY_SKILLS: 'Numeracy skills',
  ATTENTION_ORGANISING_TIME: 'Attention, organising and time management',
  LANGUAGE_COMM_SKILLS: 'Language and communication skills',
  PROCESSING_SPEED: 'Processing speed',
  MEMORY: 'Memory',
}

const formatStrengthCategoryScreenValueFilter = (value: StrengthCategory): string => strengthCategoryScreenValues[value]

export default formatStrengthCategoryScreenValueFilter
