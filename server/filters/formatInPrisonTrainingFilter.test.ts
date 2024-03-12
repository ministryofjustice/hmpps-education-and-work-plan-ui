import formatInPrisonTrainingFilter from './formatInPrisonTrainingFilter'

describe('formatInPrisonTrainingFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      { source: 'BARBERING_AND_HAIRDRESSING', expected: 'Barbering and hairdressing' },
      { source: 'CATERING', expected: 'Catering' },
      { source: 'COMMUNICATION_SKILLS', expected: 'Communication skills' },
      { source: 'ENGLISH_LANGUAGE_SKILLS', expected: 'English language skills' },
      { source: 'FORKLIFT_DRIVING', expected: 'Forklift driving' },
      { source: 'INTERVIEW_SKILLS', expected: 'Interview skills' },
      { source: 'MACHINERY_TICKETS', expected: 'Machinery tickets' },
      { source: 'NUMERACY_SKILLS', expected: 'Numeracy skills' },
      { source: 'RUNNING_A_BUSINESS', expected: 'Running a business' },
      { source: 'SOCIAL_AND_LIFE_SKILLS', expected: 'Social and life skills' },
      { source: 'WELDING_AND_METALWORK', expected: 'Welding and metalwork' },
      { source: 'WOODWORK_AND_JOINERY', expected: 'Woodwork and joinery' },
      { source: 'OTHER', expected: 'Other' },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatInPrisonTrainingFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
