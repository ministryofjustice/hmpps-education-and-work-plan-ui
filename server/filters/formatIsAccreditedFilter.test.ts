import formatIsAccreditedFilter from './formatIsAccreditedFilter'

describe('formatIsAccreditedFilter', () => {
  describe('should format true and false boolean to Accredited and Non-accredited', () => {
    Array.of({ source: true, expected: 'Accredited' }, { source: false, expected: 'Non-accredited' }).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatIsAccreditedFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
