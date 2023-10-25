import formatReasonNotToGetWorkFilter from './formatReasonNotToGetWorkFilter'

describe('formatReasonNotToGetWorkFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      { source: 'LIMIT_THEIR_ABILITY', expected: 'Feels type of offence will limit their ability to find work' },
      { source: 'FULL_TIME_CARER', expected: 'Has full-time caring responsibilities' },
      { source: 'LACKS_CONFIDENCE_OR_MOTIVATION', expected: 'Lacks confidence or motivation to find work' },
      { source: 'HEALTH', expected: 'Not able to work due to a health condition' },
      { source: 'NO_REASON', expected: 'Refused support with no reason' },
      { source: 'RETIRED', expected: 'Retired' },
      { source: 'NO_RIGHT_TO_WORK', expected: 'Right to work in the UK not confirmed' },
      { source: 'OTHER', expected: 'Other' },
      { source: 'NOT_SURE', expected: 'Not sure' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatReasonNotToGetWorkFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
