export default function formatQualificationLevelHintFilter(value: string): string {
  const levelHint = LevelHintValues[value as keyof typeof LevelHintValues]
  return levelHint
}

enum LevelHintValues {
  ENTRY_LEVEL = 'including entry level ESOL certificate (ELC) and Skills for life',
  LEVEL_1 = 'including level 1 essential or functional skills and some GCSE grades',
  LEVEL_2 = 'including some CSE and GCSE grades, level 2 NVQ and some O level grades',
  LEVEL_3 = 'including A level, international Baccalaureate diploma, advanced apprenticeship and T level',
  LEVEL_4 = 'including certificate of higher education (CertHE), level 4 diploma and higher apprenticeship',
  LEVEL_5 = 'including higher national diploma (HND), foundation degree and level 5 NVQ',
  LEVEL_6 = 'including degree with honours, graduate apprenticeship and level diploma',
  LEVEL_7 = "including master's degree, postgraduate certificate in education (PGCE) and level 7 NVQ",
  LEVEL_8 = 'including doctorate, level 8 certificate or diploma',
}
