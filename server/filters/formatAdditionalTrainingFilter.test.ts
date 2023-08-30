import formatAdditionalTrainingFilter from './formatAdditionalTrainingFilter'

describe('formatLevelOfEducationFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      { source: 'CSCS_CARD', expected: 'CSCS card' },
      { source: 'FULL_UK_DRIVING_LICENCE', expected: 'Full UK driving licence' },
      { source: 'FIRST_AID_CERTIFICATE', expected: 'First aid certificate' },
      { source: 'FOOD_HYGIENE_CERTIFICATE', expected: 'Food hygiene certificate' },
      { source: 'HEALTH_AND_SAFETY', expected: 'Health and safety' },
      { source: 'HGV_LICENCE', expected: 'HGV licence' },
      { source: 'MACHINERY_TICKETS', expected: 'Machinery tickets' },
      { source: 'MANUAL_HANDLING', expected: 'Manual handling' },
      { source: 'TRADE_COURSE', expected: 'Trade course' },
      { source: 'OTHER', expected: 'Other' },
      { source: 'NONE', expected: 'None' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatAdditionalTrainingFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
