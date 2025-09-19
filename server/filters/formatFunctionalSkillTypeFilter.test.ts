import formatFunctionalSkillTypeFilter from './formatFunctionalSkillTypeFilter'
import AssessmentTypeValue from '../enums/assessmentTypeValue'

describe('formatFunctionalSkillTypeFilter', () => {
  describe('should format the functional skill assessment type into a human readable value', () => {
    Array.of(
      { assessmentType: AssessmentTypeValue.ENGLISH, expected: 'English skills' },
      { assessmentType: AssessmentTypeValue.MATHS, expected: 'Maths skills' },
      { assessmentType: AssessmentTypeValue.DIGITAL_LITERACY, expected: 'Digital skills' },
      { assessmentType: AssessmentTypeValue.READING, expected: 'Reading' },
      { assessmentType: AssessmentTypeValue.ESOL, expected: 'ESOL' },
    ).forEach(spec => {
      it(`Assessment type: ${spec.assessmentType}, expected text: ${spec.expected}`, () => {
        expect(formatFunctionalSkillTypeFilter(spec.assessmentType)).toEqual(spec.expected)
      })
    })
  })
})
