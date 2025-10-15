import ConditionType from '../enums/conditionType'

const conditionTypeScreenValues = new Map<ConditionType, string>([
  [ConditionType.ABI, 'Acquired brain injury'],
  [ConditionType.ADHD, 'Attention deficit hyperactivity disorder (ADHD or ADD)'],
  [ConditionType.ASC, 'Autism spectrum disorder'],
  [ConditionType.DLD_LANG, 'Developmental language disorder'],
  [ConditionType.LD_DOWN, `Down's syndrome`],
  [ConditionType.DYSCALCULIA, 'Dyscalculia'],
  [ConditionType.DYSLEXIA, 'Dyslexia'],
  [ConditionType.DYSPRAXIA, 'Dyspraxia or developmental coordination disorder'],
  [ConditionType.FASD, 'Foetal alcohol spectrum disorder'],
  [ConditionType.DLD_HEAR, 'Hearing impairment'],
  [ConditionType.LD_OTHER, 'Learning disabilities'],
  [ConditionType.MENTAL_HEALTH, 'Mental health condition'],
  [ConditionType.NEURODEGEN, 'Neurodegenerative condition'],
  [ConditionType.PHYSICAL_OTHER, 'Restricted mobility or dexterity condition'],
  [ConditionType.TOURETTES, `Tourette's syndrome or tic disorder`],
  [ConditionType.VISUAL_IMPAIR, 'Visual impairment'],
  [ConditionType.OTHER, 'Disabilities or health conditions'],
  [ConditionType.DLD_OTHER, 'Language, speech or communication disorders'],
  [ConditionType.LEARN_DIFF_OTHER, 'Learning difficulties'],
  [ConditionType.LONG_TERM_OTHER, 'Long term medical conditions'],
  [ConditionType.NEURO_OTHER, 'Neurological conditions'],
])

const formatConditionTypeScreenValueFilter = (value: ConditionType): string => conditionTypeScreenValues.get(value)

export default formatConditionTypeScreenValueFilter
