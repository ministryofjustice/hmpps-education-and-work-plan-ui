import formatFunctionalSkillType from './formatFunctionalSkillTypeFilter'

describe('formatFunctionalSkillTypeFilter', () => {
  describe('should format the functional skill type into a human readable value', () => {
    Array.of(
      { formValueDate: 'ENGLISH', expected: 'English skills' },
      { formValueDate: 'MATHS', expected: 'Maths skills' },
      { formValueDate: 'DIGITAL_LITERACY', expected: 'Digital skills' },
    ).forEach(spec => {
      it(`Form value date: ${spec.formValueDate}, expected text: ${spec.expected}`, () => {
        expect(formatFunctionalSkillType(spec.formValueDate)).toEqual(spec.expected)
      })
    })
  })
})
