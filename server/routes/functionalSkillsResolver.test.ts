import moment from 'moment/moment'
import type { FunctionalSkills, Assessment } from 'viewModels'
import { allFunctionalSkills, mostRecentFunctionalSkills, functionalSkillsByType } from './functionalSkillsResolver'

describe('functionalSkillsResolver', () => {
  const NOW = moment()
  const YESTERDAY = moment(NOW).subtract(1, 'days').toDate()
  const FIVE_DAYS_AGO = moment(NOW).subtract(5, 'days').toDate()
  const TEN_DAYS_AGO = moment(NOW).subtract(10, 'days').toDate()

  describe('mostRecentFunctionalSkills', () => {
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

  describe('allFunctionalSkills', () => {
    it('should return all Functional Skills sorted by date given Functional Skills', () => {
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
          { type: 'DIGITAL_LITERACY', grade: 'Level 3', assessmentDate: YESTERDAY },
          { type: 'MATHS', grade: 'Level 3', assessmentDate: YESTERDAY },
          { type: 'MATHS', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
          { type: 'DIGITAL_LITERACY', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
          { type: 'ENGLISH', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
          { type: 'MATHS', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
          { type: 'DIGITAL_LITERACY', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
        ],
      } as FunctionalSkills

      // When
      const actual = allFunctionalSkills(functionalSkills)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return all Functional Skills given Functional Skills with no English or Maths Assessments', () => {
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
          { type: 'DIGITAL_LITERACY', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
          { type: 'DIGITAL_LITERACY', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
        ],
      } as FunctionalSkills

      // When
      const actual = allFunctionalSkills(functionalSkills)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return all Functional Skills given Functional Skills with undefined Assessments', () => {
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
      const actual = allFunctionalSkills(functionalSkills)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return all Functional Skills given Functional Skills with no Assessments', () => {
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
      const actual = allFunctionalSkills(functionalSkills)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('functionalSkillsByType', () => {
    it('should return Functional Skills by type given Assessments and type', () => {
      // Given
      const assessments = [
        { type: 'ENGLISH', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
        { type: 'MATHS', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
        { type: 'DIGITAL_LITERACY', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
        { type: 'DIGITAL_LITERACY', grade: 'Level 3', assessmentDate: YESTERDAY },
        { type: 'MATHS', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
        { type: 'DIGITAL_LITERACY', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
        { type: 'MATHS', grade: 'Level 3', assessmentDate: YESTERDAY },
      ] as Array<Assessment>

      const expected = [{ type: 'ENGLISH', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO }] as Array<Assessment>

      // When
      const actual = functionalSkillsByType(assessments, 'ENGLISH')

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return empty array given no assessments of type found', () => {
      // Given
      const assessments = [
        { type: 'MATHS', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
        { type: 'DIGITAL_LITERACY', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
        { type: 'DIGITAL_LITERACY', grade: 'Level 3', assessmentDate: YESTERDAY },
        { type: 'MATHS', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
        { type: 'DIGITAL_LITERACY', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
        { type: 'MATHS', grade: 'Level 3', assessmentDate: YESTERDAY },
      ] as Array<Assessment>

      const expected = [] as Array<Assessment>

      // When
      const actual = functionalSkillsByType(assessments, 'ENGLISH')

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
