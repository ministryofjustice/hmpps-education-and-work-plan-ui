export default function formatQualificationLevelFilter(value: string): string {
  const levelValue = LevelValues[value as keyof typeof LevelValues]
  return levelValue
}

enum LevelValues {
  ENTRY_LEVEL = 'Entry level',
  LEVEL_1 = 'Level 1',
  LEVEL_2 = 'Level 2',
  LEVEL_3 = 'Level 3',
  LEVEL_4 = 'Level 4',
  LEVEL_5 = 'Level 5',
  LEVEL_6 = 'Level 6',
  LEVEL_7 = 'Level 7',
  LEVEL_8 = 'Level 8',
}
