import type { InPrisonEducationRecords } from 'viewModels'
import {
  aValidEnglishInPrisonEducation,
  aValidMathsInPrisonEducation,
} from '../testsupport/inPrisonEducationTestDataBuilder'
import completedInPrisonEducationRecords from './inPrisonEducationRecordsResolver'

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
})
