import formatCuriousCourseStatusFilter from './formatCuriousCourseStatusFilter'

describe('formatCuriousCourseStatusFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      { source: 'IN_PROGRESS', expected: 'In progress' },
      { source: 'COMPLETED', expected: 'Completed' },
      { source: 'WITHDRAWN', expected: 'Withdrawn' },
      { source: 'TEMPORARILY_WITHDRAWN', expected: 'Temporarily withdrawn' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatCuriousCourseStatusFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
