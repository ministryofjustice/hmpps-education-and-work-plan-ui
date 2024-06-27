import formatReasonToArchiveGoalFilter from './formatReasonToArchiveGoalFilter'

describe('formatReasonToArchiveGoalFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      {
        source: 'PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL',
        expected: 'Prisoner no longer wants to work towards this goal',
      },
      {
        source: 'SUITABLE_ACTIVITIES_NOT_AVAILABLE_IN_THIS_PRISON',
        expected: 'Work or education activity needed to complete goal is not available in this prison',
      },
      {
        source: 'PRISONER_NO_LONGER_WANTS_TO_WORK_WITH_CIAG',
        expected: 'Prisoner no longer wants to work with careers, information and guidance advisors',
      },
      { source: 'OTHER', expected: 'Other' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatReasonToArchiveGoalFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
