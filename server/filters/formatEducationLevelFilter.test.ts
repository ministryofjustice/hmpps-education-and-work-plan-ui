import formatEducationLevelFilter from './formatEducationLevelFilter'

describe('formatLevelOfEducationFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      { source: 'PRIMARY_SCHOOL', expected: 'Primary school' },
      { source: 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS', expected: 'Secondary school, left before taking exams' },
      { source: 'SECONDARY_SCHOOL_TOOK_EXAMS', expected: 'Secondary school, took exams' },
      { source: 'FURTHER_EDUCATION_COLLEGE', expected: 'Further education college' },
      { source: 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY', expected: 'Undergraduate degree at university' },
      { source: 'POSTGRADUATE_DEGREE_AT_UNIVERSITY', expected: 'Postgraduate degree at university' },
      { source: 'NO_FORMAL_EDUCATION', expected: 'No formal education' },
      { source: 'NOT_SURE', expected: 'Not sure' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatEducationLevelFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
