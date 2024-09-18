import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'
import EducationLevelValue from '../../enums/educationLevelValue'
import {
  aNewAchievedQualificationDto,
  anUpdateAchievedQualificationDto,
} from '../../testsupport/achievedQualificationDtoTestDataBuilder'
import aValidUpdateEducationDto from '../../testsupport/updateEducationDtoTestDataBuilder'
import toUpdateEducationDto from './updateCreateOrUpdateEducationDtoMapper'

describe('updateCreateOrUpdateEducationDtoMapper', () => {
  it('should map EducationDto to UpdateEducationDto', () => {
    // Given
    const prisonId = 'BXI'

    const educationReference = 'dea24acc-fde5-4ead-a9eb-e1757de2542c'
    const existingQualificationReference = 'bcabb7ec-893e-4b0b-b999-6ff883fd8c6b'

    const educationDto = aValidEducationDto({
      reference: educationReference,
      educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      qualifications: [
        anUpdateAchievedQualificationDto({ reference: existingQualificationReference }),
        aNewAchievedQualificationDto(),
      ],
    })

    const expected = aValidUpdateEducationDto({
      prisonId,
      reference: educationReference,
      educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      qualifications: [
        anUpdateAchievedQualificationDto({ reference: existingQualificationReference }),
        aNewAchievedQualificationDto(),
      ],
    })

    // When
    const actual = toUpdateEducationDto(prisonId, educationDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
