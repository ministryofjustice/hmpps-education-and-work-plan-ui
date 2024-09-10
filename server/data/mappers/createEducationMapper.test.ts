import aValidCreateEducationDto from '../../testsupport/createEducationDtoTestDataBuilder'
import aValidCreateEducationRequest from '../../testsupport/createEducationRequestTestDataBuilder'
import toCreateEducationRequest from './createEducationMapper'
import EducationLevelValue from '../../enums/educationLevelValue'
import { aNewAchievedQualificationDto } from '../../testsupport/achievedQualificationDtoTestDataBuilder'
import QualificationLevelValue from '../../enums/qualificationLevelValue'

describe('createEducationMapper', () => {
  it('should map CreateOrUpdateEducationDto to CreateEducationRequest', () => {
    // Given
    const dto = aValidCreateEducationDto({
      prisonId: 'BXI',
      educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      qualifications: [
        aNewAchievedQualificationDto({
          subject: 'Needlecraft',
          grade: 'Pass',
          level: QualificationLevelValue.ENTRY_LEVEL,
        }),
      ],
    })

    const expected = aValidCreateEducationRequest({
      prisonId: 'BXI',
      educationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
      qualifications: [
        {
          subject: 'Needlecraft',
          grade: 'Pass',
          level: 'ENTRY_LEVEL',
        },
      ],
    })

    // When
    const actual = toCreateEducationRequest(dto)

    // Then
    expect(actual).toEqual(expected)
  })
})
