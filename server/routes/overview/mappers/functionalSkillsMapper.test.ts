import moment from 'moment'
import type { LearnerProfile } from 'curiousApiClient'
import type { FunctionalSkills } from 'viewModels'
import toFunctionalSkills from './functionalSkillsMapper'

describe('functionalSkillsMapper', () => {
  it('should map to functional skills given learner profiles', () => {
    // Given
    const learnerProfiles: Array<LearnerProfile> = [
      {
        prn: 'G6123VU',
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
        prn: 'G6123VU',
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
      problemRetrievingData: false,
      assessments: [
        {
          assessmentDate: moment('2012-02-16').toDate(),
          grade: 'Level 1',
          prisonId: 'MDI',
          prisonName: 'MOORLAND (HMP & YOI)',
          type: 'ENGLISH',
        },
        {
          assessmentDate: moment('2012-02-18').toDate(),
          grade: 'Level 2',
          prisonId: 'MDI',
          prisonName: 'MOORLAND (HMP & YOI)',
          type: 'MATHS',
        },
        {
          assessmentDate: moment('2022-08-29').toDate(),
          grade: 'Level 3',
          prisonId: 'DNI',
          prisonName: 'DONCASTER (HMP)',
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
      problemRetrievingData: false,
      assessments: [],
    }

    // When
    const actual = toFunctionalSkills(learnerProfiles)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to functional skills given undefined learner profiles', () => {
    // Given
    const learnerProfiles: Array<LearnerProfile> = undefined

    const expected: FunctionalSkills = {
      problemRetrievingData: false,
      assessments: undefined,
    }

    // When
    const actual = toFunctionalSkills(learnerProfiles)

    // Then
    expect(actual).toEqual(expected)
  })
})
