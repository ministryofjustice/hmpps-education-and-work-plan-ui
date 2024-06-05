import InPrisonTrainingValue from '../enums/inPrisonTrainingValue'
import sortedAlphabeticallyWithOtherLastFilter from './sortedAlphabeticallyWithOtherLastFilter'

describe('sortedAlphabeticallyWithOtherLastFilter', () => {
  it('should sort an array of enums alphabetically, but with OTHER at the end', () => {
    // Given
    const enum1 = InPrisonTrainingValue.WELDING_AND_METALWORK
    const enum2 = InPrisonTrainingValue.OTHER
    const enum3 = InPrisonTrainingValue.BARBERING_AND_HAIRDRESSING
    const enum4 = InPrisonTrainingValue.ENGLISH_LANGUAGE_SKILLS

    const enums = [enum1, enum2, enum3, enum4]

    const expected = [enum3, enum4, enum1, enum2] // alphabetically on ENUM string, with OTHER at the end

    // When
    const actual = sortedAlphabeticallyWithOtherLastFilter(enums)

    // Then
    expect(actual).toEqual(expected)
    expect(enums).toEqual([enum1, enum2, enum3, enum4]) // assert the source array has not been changed
  })
})
