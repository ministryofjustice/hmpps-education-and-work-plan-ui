export default function formatQualificationLevelHintFilter(value: string): string {
  const levelHint = LevelHintValues[value as keyof typeof LevelHintValues]
  return levelHint
}

enum LevelHintValues {
  ENTRY_LEVEL = 'including entry level ESOL certificate (ELC) and Skills for life',
  LEVEL_1 = 'including GCSE grades 1, 2 and 3 or D to G and level 1 essential or functional skills',
  LEVEL_2 = 'including GCSE grades 4 to 9 or A*, A, B and C, level 2 NVQ and O level grades A, B or C and CSE grade 1',
  LEVEL_3 = 'including A level, international Baccalaureate diploma, advanced apprenticeship and T level',
  LEVEL_4 = 'including certificate of higher education (CertHE), level 4 diploma and higher apprenticeship',
  LEVEL_5 = 'including higher national diploma (HND), foundation degree and level 5 NVQ',
  LEVEL_6 = 'including degree with honours, graduate apprenticeship and level diploma',
  LEVEL_7 = "including master's degree, postgraduate certificate in education (PGCE) and level 7 NVQ",
  LEVEL_8 = 'including doctorate, level 8 certificate or diploma',
}
