import { parseISO, startOfDay } from 'date-fns'
import type { LearnerProfile } from 'curiousApiClient'
import type { FunctionalSkills } from 'viewModels'
import toFunctionalSkills from './functionalSkillsMapper'

describe('functionalSkillsMapper', () => {
  const prisonNamesById = new Map([
    ['MDI', 'Moorland (HMP & YOI)'],
    ['DNI', 'Doncaster (HMP)'],
  ])
  it('should map to functional skills given learner profiles', () => {
    // Given
    const prisonNumber = 'G6123VU'
    const learnerProfiles: Array<LearnerProfile> = [
      {
        prn: prisonNumber,
        establishmentId: 'MDI',
        establishmentName: 'Moorland (HMP & YOI)',
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
        establishmentName: 'Doncaster (HMP)',
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
      prisonNumber,
      assessments: [
        {
          assessmentDate: startOfDay(parseISO('2012-02-16')),
          grade: 'Level 1',
          prisonId: 'MDI',
          prisonName: 'Moorland (HMP & YOI)',
          type: 'ENGLISH',
        },
        {
          assessmentDate: startOfDay(parseISO('2012-02-18')),
          grade: 'Level 2',
          prisonId: 'MDI',
          prisonName: 'Moorland (HMP & YOI)',
          type: 'MATHS',
        },
        {
          assessmentDate: startOfDay(parseISO('2022-08-29')),
          grade: 'Level 3',
          prisonId: 'DNI',
          prisonName: 'Doncaster (HMP)',
          type: 'DIGITAL_LITERACY',
        },
      ],
    }

    // When
    const actual = toFunctionalSkills(learnerProfiles, prisonNumber, prisonNamesById)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to functional skills given no learner profiles', () => {
    // Given
    const prisonNumber = 'G6123VU'

    const learnerProfiles: Array<LearnerProfile> = []

    const expected: FunctionalSkills = {
      problemRetrievingData: false,
      prisonNumber,
      assessments: [],
    }

    // When
    const actual = toFunctionalSkills(learnerProfiles, prisonNumber, prisonNamesById)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to functional skills given undefined learner profiles', () => {
    // Given
    const prisonNumber = 'G6123VU'

    const learnerProfiles: Array<LearnerProfile> = undefined

    const expected: FunctionalSkills = {
      problemRetrievingData: false,
      prisonNumber,
      assessments: undefined,
    }

    // When
    const actual = toFunctionalSkills(learnerProfiles, prisonNumber, prisonNamesById)

    // Then
    expect(actual).toEqual(expected)
  })
})
