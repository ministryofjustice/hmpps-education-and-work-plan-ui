import formatInPrisonWorkInterestFilter from './formatInPrisonWorkInterestFilter'

describe('formatInPrisonWorkInterestFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      { source: 'CLEANING_AND_HYGIENE', expected: 'Cleaning and hygiene' },
      { source: 'COMPUTERS_OR_DESK_BASED', expected: 'Computers or desk-based' },
      { source: 'GARDENING_AND_OUTDOORS', expected: 'Gardening and outdoors' },
      { source: 'KITCHENS_AND_COOKING', expected: 'Kitchens and cooking' },
      { source: 'MAINTENANCE', expected: 'Maintenance' },
      { source: 'PRISON_LAUNDRY', expected: 'Prison laundry' },
      { source: 'PRISON_LIBRARY', expected: 'Prison library' },
      { source: 'TEXTILES_AND_SEWING', expected: 'Textiles and sewing' },
      { source: 'WELDING_AND_METALWORK', expected: 'Welding and metalwork' },
      { source: 'WOODWORK_AND_JOINERY', expected: 'Woodwork and joinery' },
      { source: 'OTHER', expected: 'Other' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatInPrisonWorkInterestFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
