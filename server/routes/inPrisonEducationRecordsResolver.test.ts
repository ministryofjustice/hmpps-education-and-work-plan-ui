import moment from 'moment'
import type { InPrisonEducationRecords } from 'viewModels'
import {
  aValidEnglishInPrisonEducation,
  aValidMathsInPrisonEducation,
  aValidWoodWorkingInPrisonEducation,
} from '../testsupport/inPrisonEducationTestDataBuilder'
import {
  completedInPrisonEducationRecords,
  mostRecentCompletedInPrisonEducationRecords,
  completedInPrisonEducationRecordsWithinLast12Months,
} from './inPrisonEducationRecordsResolver'

describe('inPrisonEducationRecordsResolver', () => {
  describe('completedInPrisonEducationRecords', () => {
    it('should return completed In Prison Education records given InPrisonEducationRecords', () => {
      // Given
      const inPrisonEducationRecords: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [aValidEnglishInPrisonEducation(), aValidMathsInPrisonEducation()],
      }

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [aValidMathsInPrisonEducation()],
      }

      // When
      const actual = completedInPrisonEducationRecords(inPrisonEducationRecords)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return completed In Prison Education records given InPrisonEducationRecords with no educationRecords', () => {
      // Given
      const inPrisonEducationRecords: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [],
      }

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [],
      }

      // When
      const actual = completedInPrisonEducationRecords(inPrisonEducationRecords)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return completed In Prison Education records given InPrisonEducationRecords with undefined educationRecords', () => {
      // Given
      const inPrisonEducationRecords: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: undefined,
      }

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [],
      }

      // When
      const actual = completedInPrisonEducationRecords(inPrisonEducationRecords)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('mostRecentCompletedInPrisonEducationRecords', () => {
    it('should return most recent completed In Prison Education records given InPrisonEducationRecords', () => {
      // Given
      const englishPrisonEducation = { ...aValidEnglishInPrisonEducation() }
      englishPrisonEducation.courseStatus = 'COMPLETED'
      englishPrisonEducation.courseCompletionDate = moment('2023-07-10').toDate()
      const mathsPrisonEducation = { ...aValidMathsInPrisonEducation() }
      mathsPrisonEducation.courseStatus = 'COMPLETED'
      mathsPrisonEducation.courseCompletionDate = moment('2023-07-11').toDate()
      const woodWorkPrisonEducation = { ...aValidWoodWorkingInPrisonEducation() }
      woodWorkPrisonEducation.courseStatus = 'COMPLETED'
      woodWorkPrisonEducation.courseCompletionDate = moment('2023-06-20').toDate()

      const inPrisonEducationRecords: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [englishPrisonEducation, woodWorkPrisonEducation, mathsPrisonEducation],
      }

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [mathsPrisonEducation, englishPrisonEducation],
      }

      const maxRecordsToReturn = 2

      // When
      const actual = mostRecentCompletedInPrisonEducationRecords(inPrisonEducationRecords, maxRecordsToReturn)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return most recent completed In Prison Education records given InPrisonEducationRecords with no educationRecords', () => {
      // Given
      const inPrisonEducationRecords: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [],
      }

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [],
      }

      const maxRecordsToReturn = 10

      // When
      const actual = mostRecentCompletedInPrisonEducationRecords(inPrisonEducationRecords, maxRecordsToReturn)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return most recent completed In Prison Education records given InPrisonEducationRecords with undefined educationRecords', () => {
      // Given
      const inPrisonEducationRecords: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: undefined,
      }

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [],
      }

      const maxRecordsToReturn = 10

      // When
      const actual = mostRecentCompletedInPrisonEducationRecords(inPrisonEducationRecords, maxRecordsToReturn)

      // Then
      expect(actual).toEqual(expected)
    })
  })
  describe('completedInPrisonEducationRecordsWithinLast12Months', () => {
    it('should return completed In Prison Education records within last 12 months given InPrisonEducationRecords', () => {
      // Given
      const englishPrisonEducation = { ...aValidEnglishInPrisonEducation() }
      englishPrisonEducation.courseStatus = 'COMPLETED'
      englishPrisonEducation.courseCompletionDate = moment().subtract(7, 'months').toDate()
      const mathsPrisonEducation = { ...aValidMathsInPrisonEducation() }
      mathsPrisonEducation.courseStatus = 'COMPLETED'
      mathsPrisonEducation.courseCompletionDate = moment().subtract(4, 'months').toDate()

      const woodWorkPrisonEducation = { ...aValidWoodWorkingInPrisonEducation() }
      woodWorkPrisonEducation.courseStatus = 'COMPLETED'
      woodWorkPrisonEducation.courseCompletionDate = moment('2021-06-20').toDate()

      const inPrisonEducationRecords: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [englishPrisonEducation, woodWorkPrisonEducation, mathsPrisonEducation],
      }

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [mathsPrisonEducation, englishPrisonEducation],
      }

      // When
      const actual = completedInPrisonEducationRecordsWithinLast12Months(inPrisonEducationRecords)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return completed In Prison Education records within last 12 months given InPrisonEducationRecords with no educationRecords', () => {
      // Given
      const inPrisonEducationRecords: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [],
      }

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [],
      }

      // When
      const actual = completedInPrisonEducationRecordsWithinLast12Months(inPrisonEducationRecords)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return completed In Prison Education records within last 12 months given InPrisonEducationRecords with undefined educationRecords', () => {
      // Given
      const inPrisonEducationRecords: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: undefined,
      }

      const expected: InPrisonEducationRecords = {
        problemRetrievingData: false,
        educationRecords: [],
      }

      // When
      const actual = completedInPrisonEducationRecordsWithinLast12Months(inPrisonEducationRecords)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
