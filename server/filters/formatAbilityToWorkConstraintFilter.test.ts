import formatAbilityToWorkConstraintFilter from './formatAbilityToWorkConstraintFilter'

describe('formatAbilityToWorkConstraintFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      { source: 'LIMITED_BY_OFFENSE', expected: 'Feels type of offence will limit their ability to find work' },
      { source: 'CARING_RESPONSIBILITIES', expected: 'Has caring responsibilities' },
      { source: 'HEALTH_ISSUES', expected: 'May need work adjustments due to a health condition' },
      { source: 'NO_RIGHT_TO_WORK', expected: 'Right to work in the UK not confirmed' },
      { source: 'OTHER', expected: 'Other' },
      { source: 'NONE', expected: 'None' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatAbilityToWorkConstraintFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
