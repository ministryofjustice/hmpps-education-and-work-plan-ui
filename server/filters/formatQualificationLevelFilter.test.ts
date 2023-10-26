import formatQualificationLevelFilter from './formatQualificationLevelFilter'

describe('formatQualificationLevelFilter', () => {
  describe('should format qualification level', () => {
    Array.of(
      { source: 'ENTRY_LEVEL', expected: 'Entry level' },
      { source: 'LEVEL_1', expected: 'Level 1' },
      { source: 'LEVEL_2', expected: 'Level 2' },
      { source: 'LEVEL_3', expected: 'Level 3' },
      { source: 'LEVEL_4', expected: 'Level 4' },
      { source: 'LEVEL_5', expected: 'Level 5' },
      { source: 'LEVEL_6', expected: 'Level 6' },
      { source: 'LEVEL_7', expected: 'Level 7' },
      { source: 'LEVEL_8', expected: 'Level 8' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatQualificationLevelFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
