import ChallengeCategory from '../enums/challengeCategory'

const challengeCategoryScreenValues: Record<ChallengeCategory, string> = {
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

const formatChallengeCategoryScreenValueFilter = (value: ChallengeCategory): string =>
  challengeCategoryScreenValues[value]

export default formatChallengeCategoryScreenValueFilter
