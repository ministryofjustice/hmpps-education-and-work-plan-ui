import formatQualificationLevelHintFilter from './formatQualificationLevelHintFilter'

describe('formatQualificationLevelHintFilter', () => {
  describe('should format qualification level hint', () => {
    Array.of(
      { source: 'ENTRY_LEVEL', expected: 'including entry level ESOL certificate (ELC) and Skills for life' },
      { source: 'LEVEL_1', expected: 'including level 1 essential or functional skills and some GCSE grades' },
      { source: 'LEVEL_2', expected: 'including some CSE and GCSE grades, level 2 NVQ and some O level grades' },
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
