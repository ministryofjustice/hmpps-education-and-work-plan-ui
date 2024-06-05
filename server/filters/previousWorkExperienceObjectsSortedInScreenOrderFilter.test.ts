import type { PreviousWorkExperienceDto } from 'inductionDto'
import TypeOfWorkExperienceValue from '../enums/typeOfWorkExperienceValue'
import previousWorkExperienceObjectsSortedInScreenOrderFilter from './previousWorkExperienceObjectsSortedInScreenOrderFilter'

describe('previousWorkExperienceObjectsSortedInScreenOrderFilter', () => {
  it('should sort an array of PreviousWorkExperienceDto into screen order', () => {
    // Given
    const workExperiences: Array<PreviousWorkExperienceDto> = [
      { experienceType: TypeOfWorkExperienceValue.BEAUTY, role: 'Nail technician' },
      { experienceType: TypeOfWorkExperienceValue.CLEANING_AND_MAINTENANCE, role: 'Office cleaner' },
      { experienceType: TypeOfWorkExperienceValue.CONSTRUCTION, role: 'Builder' },
      { experienceType: TypeOfWorkExperienceValue.DRIVING, role: 'Delivery driver' },
      { experienceType: TypeOfWorkExperienceValue.EDUCATION_TRAINING, role: 'Teaching assistant' },
      { experienceType: TypeOfWorkExperienceValue.HOSPITALITY, role: 'Chef' },
      { experienceType: TypeOfWorkExperienceValue.MANUFACTURING, role: 'Machine operator' },
      { experienceType: TypeOfWorkExperienceValue.OFFICE, role: 'Office junior' },
      { experienceType: TypeOfWorkExperienceValue.OTHER, experienceTypeOther: 'Self employed', role: 'Gardener' },
      { experienceType: TypeOfWorkExperienceValue.OUTDOOR, role: 'Farm hand' },
      { experienceType: TypeOfWorkExperienceValue.RETAIL, role: 'Shop assistant' },
      { experienceType: TypeOfWorkExperienceValue.SPORTS, role: 'Personal trainer' },
      { experienceType: TypeOfWorkExperienceValue.TECHNICAL, role: 'Software developer' },
      { experienceType: TypeOfWorkExperienceValue.WAREHOUSING, role: 'Forklift driver' },
      { experienceType: TypeOfWorkExperienceValue.WASTE_MANAGEMENT, role: 'Bin man' },
    ]

    const expected: Array<PreviousWorkExperienceDto> = [
      { experienceType: TypeOfWorkExperienceValue.OUTDOOR, role: 'Farm hand' },
      { experienceType: TypeOfWorkExperienceValue.CLEANING_AND_MAINTENANCE, role: 'Office cleaner' },
      { experienceType: TypeOfWorkExperienceValue.CONSTRUCTION, role: 'Builder' },
      { experienceType: TypeOfWorkExperienceValue.DRIVING, role: 'Delivery driver' },
      { experienceType: TypeOfWorkExperienceValue.BEAUTY, role: 'Nail technician' },
      { experienceType: TypeOfWorkExperienceValue.HOSPITALITY, role: 'Chef' },
      { experienceType: TypeOfWorkExperienceValue.TECHNICAL, role: 'Software developer' },
      { experienceType: TypeOfWorkExperienceValue.MANUFACTURING, role: 'Machine operator' },
      { experienceType: TypeOfWorkExperienceValue.OFFICE, role: 'Office junior' },
      { experienceType: TypeOfWorkExperienceValue.RETAIL, role: 'Shop assistant' },
      { experienceType: TypeOfWorkExperienceValue.SPORTS, role: 'Personal trainer' },
      { experienceType: TypeOfWorkExperienceValue.EDUCATION_TRAINING, role: 'Teaching assistant' },
      { experienceType: TypeOfWorkExperienceValue.WAREHOUSING, role: 'Forklift driver' },
      { experienceType: TypeOfWorkExperienceValue.WASTE_MANAGEMENT, role: 'Bin man' },
      { experienceType: TypeOfWorkExperienceValue.OTHER, experienceTypeOther: 'Self employed', role: 'Gardener' },
    ]

    // When
    const actual = previousWorkExperienceObjectsSortedInScreenOrderFilter(workExperiences)

    // Then
    expect(actual).toEqual(expected)
  })
})
