import formatQualificationLevelHintFilter from './formatQualificationLevelHintFilter'

describe('formatQualificationLevelHintFilter', () => {
  describe('should format qualification level hint', () => {
    Array.of(
      { source: 'ENTRY_LEVEL', expected: 'including entry level ESOL certificate (ELC) and Skills for life' },
      {
        source: 'LEVEL_1',
        expected: 'including GCSE grades 1, 2 and 3 or D to G and level 1 essential or functional skills',
      },
      {
        source: 'LEVEL_2',
        expected:
          'including GCSE grades 4 to 9 or A*, A, B and C, level 2 NVQ and O level grades A, B or C and CSE grade 1',
      },
      {
        source: 'LEVEL_3',
        expected: 'including A level, international Baccalaureate diploma, advanced apprenticeship and T level',
      },
      {
        source: 'LEVEL_4',
        expected: 'including certificate of higher education (CertHE), level 4 diploma and higher apprenticeship',
      },
      { source: 'LEVEL_5', expected: 'including higher national diploma (HND), foundation degree and level 5 NVQ' },
      { source: 'LEVEL_6', expected: 'including degree with honours, graduate apprenticeship and level diploma' },
      {
        source: 'LEVEL_7',
        expected: "including master's degree, postgraduate certificate in education (PGCE) and level 7 NVQ",
      },
      { source: 'LEVEL_8', expected: 'including doctorate, level 8 certificate or diploma' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatQualificationLevelHintFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
