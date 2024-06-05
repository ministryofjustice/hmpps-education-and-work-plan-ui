import enumComparator from './enumComparator'
import InPrisonWorkValue from '../../enums/inPrisonWorkValue'
import ReasonNotToGetWorkValue from '../../enums/reasonNotToGetWorkValue'
import InPrisonTrainingValue from '../../enums/inPrisonTrainingValue'

describe('enumComparator', () => {
  it(`should determine if a ENUM string is alphabetically before another ENUM string`, () => {
    // Given
    const enum1 = InPrisonWorkValue.CLEANING_AND_HYGIENE
    const enum2 = InPrisonWorkValue.WOODWORK_AND_JOINERY

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should determine if a ENUM string is alphabetically before another ENUM string using character later in the string`, () => {
    // Given
    const enum1 = InPrisonWorkValue.PRISON_LAUNDRY
    const enum2 = InPrisonWorkValue.PRISON_LIBRARY

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should determine if a ENUM string is alphabetically after another ENUM string`, () => {
    // Given
    const enum1 = ReasonNotToGetWorkValue.RETIRED
    const enum2 = ReasonNotToGetWorkValue.HEALTH

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return 1 given a ENUM string which is 'OTHER' and another ENUM string is alphabetically before 'OTHER'`, () => {
    // Given
    const enum1 = InPrisonWorkValue.OTHER
    const enum2 = InPrisonWorkValue.CLEANING_AND_HYGIENE

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return 1 given a ENUM string which 'OTHER' and another ENUM string is alphabetically after 'OTHER'`, () => {
    // Given
    const enum1 = InPrisonWorkValue.OTHER
    const enum2 = InPrisonWorkValue.WOODWORK_AND_JOINERY

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return -1 given an ENUM string is alphabetically before 'OTHER' and ENUM string iss 'OTHER'`, () => {
    // Given
    const enum1 = InPrisonWorkValue.CLEANING_AND_HYGIENE
    const enum2 = InPrisonWorkValue.OTHER

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should return -1 given an ENUM string is alphabetically after 'OTHER' and ENUM string is 'OTHER'`, () => {
    // Given
    const enum1 = InPrisonWorkValue.WOODWORK_AND_JOINERY
    const enum2 = InPrisonWorkValue.OTHER

    // When
    const actual = enumComparator(enum1, enum2)

    // Then
    expect(actual).toEqual(-1)
  })

  it('should sort an array ENUM strings alphabetically, but with OTHER at the end', () => {
    // Given
    const enum1 = InPrisonTrainingValue.WELDING_AND_METALWORK
    const enum2 = InPrisonTrainingValue.OTHER
    const enum3 = InPrisonTrainingValue.BARBERING_AND_HAIRDRESSING
    const enum4 = InPrisonTrainingValue.ENGLISH_LANGUAGE_SKILLS

    const enums = [enum1, enum2, enum3, enum4]

    const expected = [enum3, enum4, enum1, enum2] // alphabetically on ENUM string, with OTHER at the end

    // When
    enums.sort(enumComparator)

    // Then
    expect(enums).toEqual(expected)
  })
})
