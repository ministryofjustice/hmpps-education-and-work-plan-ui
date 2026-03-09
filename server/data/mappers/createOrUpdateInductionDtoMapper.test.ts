import toCreateOrUpdateInductionDto from './createOrUpdateInductionDtoMapper'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import aValidUpdateInductionDto from '../../testsupport/updateInductionDtoTestDataBuilder'
import aPersonalSkillsAndInterestsDto from '../../testsupport/personalSkillsAndInterestsDtoTestDataBuilder'
import { aPersonalSkillDto } from '../../testsupport/createOrUpdatePersonalSkillsAndInterestsDtoTestDataBuilder'
import SkillsValue from '../../enums/skillsValue'
import { aPersonalSkill } from '../../testsupport/createPersonalSkillsAndInterestsRequestTestDataBuilder'
import { anEmployabilitySkillResponseDto } from '../../testsupport/employabilitySkillResponseDtoTestDataBuilder'
import aCreateEmployabilitySkillDto from '../../testsupport/ createEmployabilitySkillDtoTestDataBuilder'

describe('createOrUpdateInductionDtoMapper', () => {
  it('should map an InductionDto to a CreateOrUpdateInductionDto given a DTO with personal skills instead of employability skills', () => {
    // Given
    const prisonId = 'MDI'
    const inductionDto = aValidInductionDto({
      employabilitySkills: null,
      personalSkillsAndInterests: aPersonalSkillsAndInterestsDto({
        skills: [
          aPersonalSkillDto({ skillType: SkillsValue.WILLINGNESS_TO_LEARN }),
          aPersonalSkillDto({ skillType: SkillsValue.OTHER, skillTypeOther: 'Tenacity' }),
        ],
      }),
    })
    const expected = aValidUpdateInductionDto({
      employabilitySkills: null,
      personalSkillsAndInterests: aPersonalSkillsAndInterestsDto({
        skills: [
          aPersonalSkill({ skillType: SkillsValue.WILLINGNESS_TO_LEARN }),
          aPersonalSkill({ skillType: SkillsValue.OTHER, skillTypeOther: 'Tenacity' }),
        ],
      }),
    })

    // When
    const actual = toCreateOrUpdateInductionDto(prisonId, inductionDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map an InductionDto to a CreateOrUpdateInductionDto given a DTO with employability skills instead of personal skills', () => {
    // Given
    const prisonId = 'MDI'
    const inductionDto = aValidInductionDto({
      employabilitySkills: [anEmployabilitySkillResponseDto()],
      personalSkillsAndInterests: aPersonalSkillsAndInterestsDto({
        skills: null,
      }),
    })
    const expected = aValidUpdateInductionDto({
      employabilitySkills: [aCreateEmployabilitySkillDto({ prisonId })],
      personalSkillsAndInterests: aPersonalSkillsAndInterestsDto({
        skills: null,
      }),
    })

    // When
    const actual = toCreateOrUpdateInductionDto(prisonId, inductionDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
