import SupportStrategyType from '../enums/supportStrategyType'

const supportStrategyTypeScreenValues: Record<SupportStrategyType, string> = {
  SENSORY: 'Sensory',
  EMOTIONS_FEELINGS_DEFAULT: 'Emotions and feelings',
  PHYSICAL_SKILLS_DEFAULT: 'Physical skills and coordination',
  LITERACY_SKILLS_DEFAULT: 'Literacy skills',
  NUMERACY_SKILLS_DEFAULT: 'Numeracy skills',
  ATTENTION_ORGANISING_TIME_DEFAULT: 'Attention, organising and time management',
  LANGUAGE_COMM_SKILLS_DEFAULT: 'Language and communication skills',
  PROCESSING_SPEED: 'Processing speed',
  MEMORY: 'Memory',
  GENERAL: 'General need',
}

const supportStrategyTypeHintTextValues: Record<SupportStrategyType, string> = {
  SENSORY: 'Things like reacting to some environments or situations eg noise or being touched',
  EMOTIONS_FEELINGS_DEFAULT: 'Things like confidence, empathy, managing emotions and impulses',
  PHYSICAL_SKILLS_DEFAULT: 'Things like learning new skills, co-ordination, stamina and fine motor skills',
  LITERACY_SKILLS_DEFAULT: 'Things like reading, writing and spelling',
  NUMERACY_SKILLS_DEFAULT: 'Things like maths and managing money',
  ATTENTION_ORGANISING_TIME_DEFAULT: 'Things like planning, task management, tidiness and focus',
  LANGUAGE_COMM_SKILLS_DEFAULT: 'Things like taking turns, listening and language fluency',
  PROCESSING_SPEED: 'Things like taking time to understand and follow instructions',
  MEMORY: 'Things like remembering and recalling information',
  GENERAL: '',
}

const formatSupportStrategyTypeScreenValueFilter = (value: SupportStrategyType): string =>
  supportStrategyTypeScreenValues[value]

const formatSupportStrategyTypeHintTextFilter = (value: SupportStrategyType): string =>
  supportStrategyTypeHintTextValues[value]

export { formatSupportStrategyTypeScreenValueFilter, formatSupportStrategyTypeHintTextFilter }
