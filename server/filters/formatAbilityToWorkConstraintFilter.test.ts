import formatAbilityToWorkConstraintFilter from './formatAbilityToWorkConstraintFilter'

describe('formatAbilityToWorkConstraintFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      { source: 'LIMITED_BY_OFFENCE', expected: 'Feels type of offence will limit their ability to find work' },
      { source: 'CARING_RESPONSIBILITIES', expected: 'Has caring responsibilities' },
      {
        source: 'NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH',
        expected: 'May need work adjustments due to a health condition',
      },
      { source: 'UNABLE_TO_WORK_DUE_TO_HEALTH', expected: 'Not able to work due to a health condition' },
      { source: 'LACKS_CONFIDENCE_OR_MOTIVATION', expected: 'Lacks confidence or motivation to find work' },
      { source: 'REFUSED_SUPPORT_WITH_NO_REASON', expected: 'Refused support with no reason' },
      { source: 'RETIRED', expected: 'Retired' },
      { source: 'NO_RIGHT_TO_WORK', expected: 'Right to work in the UK not confirmed' },
      { source: 'NOT_SURE', expected: 'Not sure' },
      { source: 'OTHER', expected: 'Other' },
      { source: 'NONE', expected: 'None' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatAbilityToWorkConstraintFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
