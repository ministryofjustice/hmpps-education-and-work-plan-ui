import formatPersonalInterestsFilter from './formatPersonalInterestsFilter'

describe('formatPersonalInterestsFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      { source: 'COMMUNITY', expected: 'Community' },
      { source: 'CRAFTS', expected: 'Crafts' },
      { source: 'CREATIVE', expected: 'Creative' },
      { source: 'DIGITAL', expected: 'Digital' },
      { source: 'KNOWLEDGE_BASED', expected: 'Knowledge-based' },
      { source: 'MUSICAL', expected: 'Musical' },
      { source: 'OUTDOOR', expected: 'Outdoor' },
      { source: 'NATURE_AND_ANIMALS', expected: 'Nature and animals' },
      { source: 'SOCIAL', expected: 'Social' },
      { source: 'SOLO_ACTIVITIES', expected: 'Solo activities' },
      { source: 'SOLO_SPORTS', expected: 'Solo sports' },
      { source: 'TEAM_SPORTS', expected: 'Team sports' },
      { source: 'WELLNESS', expected: 'Wellness' },
      { source: 'OTHER', expected: 'Other' },
      { source: 'NONE', expected: 'None of these' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatPersonalInterestsFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
