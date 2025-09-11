import { parseISO, startOfDay } from 'date-fns'
import type { LearnerProfile } from 'curiousApiClient'
import type { FunctionalSkills } from 'viewModels'
import toFunctionalSkills from './functionalSkillsMapper'

describe('functionalSkillsMapper', () => {
  it('should map to functional skills given learner profiles', () => {
    // Given
    const prisonNumber = 'G6123VU'
    const learnerProfiles: Array<LearnerProfile> = [
      {
        prn: prisonNumber,
        establishmentId: 'MDI',
        establishmentName: 'MOORLAND (HMP & YOI)',
        qualifications: [
          {
            qualificationType: 'English',
            qualificationGrade: 'Level 1',
            assessmentDate: '2012-02-16',
          },
          {
            qualificationType: 'Maths',
            qualificationGrade: 'Level 2',
            assessmentDate: '2012-02-18',
          },
        ],
      },
      {
        prn: prisonNumber,
        establishmentId: 'DNI',
        establishmentName: 'DONCASTER (HMP)',
        qualifications: [
          {
            qualificationType: 'Digital Literacy',
            qualificationGrade: 'Level 3',
            assessmentDate: '2022-08-29',
          },
        ],
      },
    ]

    const expected: FunctionalSkills = {
      assessments: [
        {
          assessmentDate: startOfDay(parseISO('2012-02-16')),
          grade: 'Level 1',
          prisonId: 'MDI',
          type: 'ENGLISH',
        },
        {
          assessmentDate: startOfDay(parseISO('2012-02-18')),
          grade: 'Level 2',
          prisonId: 'MDI',
          type: 'MATHS',
        },
        {
          assessmentDate: startOfDay(parseISO('2022-08-29')),
          grade: 'Level 3',
          prisonId: 'DNI',
          type: 'DIGITAL_LITERACY',
        },
      ],
    }

    // When
    const actual = toFunctionalSkills(learnerProfiles)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to functional skills given no learner profiles', () => {
    // Given
    const learnerProfiles: Array<LearnerProfile> = []

    const expected: FunctionalSkills = {
      assessments: [],
    }

    // When
    const actual = toFunctionalSkills(learnerProfiles)

    // Then
    expect(actual).toEqual(expected)
  })
})
