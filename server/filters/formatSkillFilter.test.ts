import formatSkillFilter from './formatSkillFilter'

describe('formatSkillFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      { source: 'COMMUNICATION', expected: 'Communication' },
      { source: 'POSITIVE_ATTITUDE', expected: 'Positive attitude' },
      { source: 'RESILIENCE', expected: 'Resilience' },
      { source: 'SELF_MANAGEMENT', expected: 'Self-management' },
      { source: 'TEAMWORK', expected: 'Teamwork' },
      { source: 'THINKING_AND_PROBLEM_SOLVING', expected: 'Thinking and problem-solving' },
      { source: 'WILLINGNESS_TO_LEARN', expected: 'Willingness to learn' },
      { source: 'OTHER', expected: 'Other' },
      { source: 'NONE', expected: 'None of these' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatSkillFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
