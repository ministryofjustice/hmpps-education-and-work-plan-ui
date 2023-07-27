import moment from 'moment'
import type { LearnerProfile } from 'curiousApiClient'
import type { FunctionalSkills } from 'viewModels'
import { mostRecentFunctionalSkills, toFunctionalSkills } from './functionalSkillsMapper'

describe('functionalSkillsMapper', () => {
  describe('toFunctionalSkills', () => {
    it('should map to Functional Skills given learner profiles', () => {
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

    it('should map to Functional Skills given no learner profiles', () => {
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

    it('should map to Functional Skills given undefined learner profiles', () => {
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

  describe('mostRecentFunctionalSkills', () => {
    const NOW = moment()
    const YESTERDAY = moment(NOW).subtract(1, 'days').toDate()
    const FIVE_DAYS_AGO = moment(NOW).subtract(5, 'days').toDate()
    const TEN_DAYS_AGO = moment(NOW).subtract(10, 'days').toDate()

    it('should return most recent Functional Skills given Functional Skills', () => {
      // Given
      const functionalSkills = {
        problemRetrievingData: false,
        assessments: [
          { type: 'ENGLISH', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
          { type: 'MATHS', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
          { type: 'DIGITAL_LITERACY', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
          { type: 'DIGITAL_LITERACY', grade: 'Level 3', assessmentDate: YESTERDAY },
          { type: 'MATHS', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
          { type: 'DIGITAL_LITERACY', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
          { type: 'MATHS', grade: 'Level 3', assessmentDate: YESTERDAY },
        ],
      } as FunctionalSkills

      const expected = {
        problemRetrievingData: false,
        assessments: [
          { type: 'ENGLISH', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
          { type: 'MATHS', grade: 'Level 3', assessmentDate: YESTERDAY },
          { type: 'DIGITAL_LITERACY', grade: 'Level 3', assessmentDate: YESTERDAY },
        ],
      } as FunctionalSkills

      // When
      const actual = mostRecentFunctionalSkills(functionalSkills)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return most recent Functional Skills given Functional Skills with no English or Maths Assessments', () => {
      // Given
      const functionalSkills = {
        problemRetrievingData: false,
        assessments: [
          { type: 'DIGITAL_LITERACY', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
          { type: 'DIGITAL_LITERACY', grade: 'Level 3', assessmentDate: YESTERDAY },
          { type: 'DIGITAL_LITERACY', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
        ],
      } as FunctionalSkills

      const expected = {
        problemRetrievingData: false,
        assessments: [
          { type: 'ENGLISH' },
          { type: 'MATHS' },
          { type: 'DIGITAL_LITERACY', grade: 'Level 3', assessmentDate: YESTERDAY },
        ],
      } as FunctionalSkills

      // When
      const actual = mostRecentFunctionalSkills(functionalSkills)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return most recent Functional Skills given Functional Skills with undefined Assessments', () => {
      // Given
      const functionalSkills = {
        problemRetrievingData: false,
        assessments: undefined,
      } as FunctionalSkills

      const expected = {
        problemRetrievingData: false,
        assessments: [{ type: 'ENGLISH' }, { type: 'MATHS' }],
      } as FunctionalSkills

      // When
      const actual = mostRecentFunctionalSkills(functionalSkills)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return most recent Functional Skills given Functional Skills with no Assessments', () => {
      // Given
      const functionalSkills = {
        problemRetrievingData: false,
        assessments: [],
      } as FunctionalSkills

      const expected = {
        problemRetrievingData: false,
        assessments: [{ type: 'ENGLISH' }, { type: 'MATHS' }],
      } as FunctionalSkills

      // When
      const actual = mostRecentFunctionalSkills(functionalSkills)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
