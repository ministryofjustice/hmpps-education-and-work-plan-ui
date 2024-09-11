import toCreateEducationDto from './createCreateOrUpdateEducationDtoMapper'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'
import aValidCreateEducationDto from '../../testsupport/createEducationDtoTestDataBuilder'
import EducationLevelValue from '../../enums/educationLevelValue'
import { aNewAchievedQualificationDto } from '../../testsupport/achievedQualificationDtoTestDataBuilder'

describe('createCreateOrUpdateEducationDtoMapper', () => {
  it('should map EducationDto to CreateEducationDto', () => {
    // Given
    const prisonId = 'BXI'
    const educationDto = aValidEducationDto({
      educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      qualifications: [aNewAchievedQualificationDto()],
    })

    const expected = aValidCreateEducationDto({
      prisonId,
      educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      qualifications: [aNewAchievedQualificationDto()],
    })

    // When
    const actual = toCreateEducationDto(prisonId, educationDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
