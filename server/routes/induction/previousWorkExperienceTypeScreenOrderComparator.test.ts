import TypeOfWorkExperienceValue from '../../enums/typeOfWorkExperienceValue'
import previousWorkExperienceTypeScreenOrderComparator from './previousWorkExperienceTypeScreenOrderComparator'

describe('previousWorkExperienceTypeScreenOrderComparator', () => {
  it('should sort an array of TypeOfWorkExperienceValue into screen order', () => {
    // Given
    const typesOfWorkExperience = [
      TypeOfWorkExperienceValue.BEAUTY,
      TypeOfWorkExperienceValue.CLEANING_AND_MAINTENANCE,
      TypeOfWorkExperienceValue.CONSTRUCTION,
      TypeOfWorkExperienceValue.DRIVING,
      TypeOfWorkExperienceValue.EDUCATION_TRAINING,
      TypeOfWorkExperienceValue.HOSPITALITY,
      TypeOfWorkExperienceValue.MANUFACTURING,
      TypeOfWorkExperienceValue.OFFICE,
      TypeOfWorkExperienceValue.OTHER,
      TypeOfWorkExperienceValue.OUTDOOR,
      TypeOfWorkExperienceValue.RETAIL,
      TypeOfWorkExperienceValue.SPORTS,
      TypeOfWorkExperienceValue.TECHNICAL,
      TypeOfWorkExperienceValue.WAREHOUSING,
      TypeOfWorkExperienceValue.WASTE_MANAGEMENT,
    ]

    const expected = [
      TypeOfWorkExperienceValue.OUTDOOR,
      TypeOfWorkExperienceValue.CLEANING_AND_MAINTENANCE,
      TypeOfWorkExperienceValue.CONSTRUCTION,
      TypeOfWorkExperienceValue.DRIVING,
      TypeOfWorkExperienceValue.BEAUTY,
      TypeOfWorkExperienceValue.HOSPITALITY,
      TypeOfWorkExperienceValue.TECHNICAL,
      TypeOfWorkExperienceValue.MANUFACTURING,
      TypeOfWorkExperienceValue.OFFICE,
      TypeOfWorkExperienceValue.RETAIL,
      TypeOfWorkExperienceValue.SPORTS,
      TypeOfWorkExperienceValue.EDUCATION_TRAINING,
      TypeOfWorkExperienceValue.WAREHOUSING,
      TypeOfWorkExperienceValue.WASTE_MANAGEMENT,
      TypeOfWorkExperienceValue.OTHER,
    ]

    // When
    const actual = [...typesOfWorkExperience.sort(previousWorkExperienceTypeScreenOrderComparator)]

    // Then
    expect(actual).toEqual(expected)
  })
})
