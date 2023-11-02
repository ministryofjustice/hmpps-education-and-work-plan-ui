import enumComparator from './enumComparator'

describe('enumComparator', () => {
  it(`should determine if a ENUM string is alphabetically before another ENUM string`, () => {
    // Given
    const enumString1 = 'CLEANING_AND_HYGIENE'
    const enumString2 = 'WOODWORK_AND_JOINERY'

    // When
    const actual = enumComparator(enumString1, enumString2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should determine if a ENUM string is alphabetically before another ENUM string using character later in the string`, () => {
    // Given
    const enumString1 = 'PRISON_LAUNDRY'
    const enumString2 = 'PRISON_LIBRARY'

    // When
    const actual = enumComparator(enumString1, enumString2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should determine if a ENUM string is alphabetically after another ENUM string`, () => {
    // Given
    const enumString1 = 'RETIRED'
    const enumString2 = 'HEALTH'

    // When
    const actual = enumComparator(enumString1, enumString2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return 1 given a ENUM string which is 'OTHER' and another ENUM string is alphabetically before 'OTHER'`, () => {
    // Given
    const enumString1 = 'OTHER'
    const enumString2 = 'CLEANING_AND_HYGIENE'

    // When
    const actual = enumComparator(enumString1, enumString2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return 1 given a ENUM string which 'OTHER' and another ENUM string is alphabetically after 'OTHER'`, () => {
    // Given
    const enumString1 = 'OTHER'
    const enumString2 = 'WOODWORK_AND_JOINERY'

    // When
    const actual = enumComparator(enumString1, enumString2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return -1 given an ENUM string is alphabetically before 'OTHER' and ENUM string iss 'OTHER'`, () => {
    // Given
    const enumString1 = 'CLEANING_AND_HYGIENE'
    const enumString2 = 'OTHER'

    // When
    const actual = enumComparator(enumString1, enumString2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should return -1 given an ENUM string is alphabetically after 'OTHER' and ENUM string is 'OTHER'`, () => {
    // Given
    const enumString1 = 'WOODWORK_AND_JOINERY'
    const enumString2 = 'OTHER'

    // When
    const actual = enumComparator(enumString1, enumString2)

    // Then
    expect(actual).toEqual(-1)
  })

  it('should sort an array ENUM strings alphabetically, but with OTHER at the end', () => {
    // Given
    const enumString1 = 'WELDING_AND_METALWORK'
    const enumString2 = 'OTHER'
    const enumString3 = 'BARBERING_AND_HAIRDRESSING'
    const enumString4 = 'ENGLISH_LANGUAGE_SKILLS'

    const enums = [enumString1, enumString2, enumString3, enumString4]

    const expected = [enumString3, enumString4, enumString1, enumString2] // alphabetically on ENUM string, with OTHER at the end

    // When
    enums.sort(enumComparator)

    // Then
    expect(enums).toEqual(expected)
  })
})
