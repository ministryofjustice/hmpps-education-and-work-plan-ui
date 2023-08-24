import formatJobTypeFilter from './formatJobTypeFilter'

describe('formatJobTypeFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      { source: 'OUTDOOR', expected: 'Animal care and farming' },
      { source: 'CONSTRUCTION', expected: 'Construction and trade' },
      { source: 'DRIVING', expected: 'Driving and transport' },
      { source: 'BEAUTY', expected: 'Hair, beauty and wellbeing' },
      { source: 'HOSPITALITY', expected: 'Hospitality and catering' },
      { source: 'TECHNICAL', expected: 'IT and digital' },
      { source: 'MANUFACTURING', expected: 'Manufacturing and technical' },
      { source: 'OFFICE', expected: 'Office or desk-based' },
      { source: 'RETAIL', expected: 'Retail and sales' },
      { source: 'SPORTS', expected: 'Sport and fitness' },
      { source: 'WAREHOUSING', expected: 'Warehousing and storage' },
      { source: 'WASTE_MANAGEMENT', expected: 'Waste management' },
      { source: 'EDUCATION_TRAINING', expected: 'Training and support' },
      { source: 'CLEANING_AND_MAINTENANCE', expected: 'Cleaning and maintenance' },
      { source: 'OTHER', expected: 'Other' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatJobTypeFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
