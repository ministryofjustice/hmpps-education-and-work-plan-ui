import aValidCreateOrUpdateInductionDto from '../../testsupport/createInductionDtoTestDataBuilder'
import aValidCreateInductionRequest from '../../testsupport/createInductionRequestTestDataBuilder'
import toCreateInductionRequest from './createInductionMapper'
import {
  aCreateOrUpdatePersonalSkillsAndInterestsDto,
  aPersonalSkillDto,
} from '../../testsupport/createOrUpdatePersonalSkillsAndInterestsDtoTestDataBuilder'
import SkillsValue from '../../enums/skillsValue'
import {
  aCreatePersonalSkillsAndInterestsRequest,
  aPersonalSkill,
} from '../../testsupport/createPersonalSkillsAndInterestsRequestTestDataBuilder'
import aCreateEmployabilitySkillDto from '../../testsupport/ createEmployabilitySkillDtoTestDataBuilder'
import { aCreateEmployabilitySkillRequest } from '../../testsupport/createEmployabilitySkillsRequestTestDataBuilder'

describe('createInductionMapper', () => {
  it('should map a CreateOrUpdateInductionDto to a CreateInductionRequest given a DTO with personal skills instead of employability skills', () => {
    // Given
    const createInductionDto = aValidCreateOrUpdateInductionDto({
      employabilitySkills: null,
      personalSkillsAndInterests: aCreateOrUpdatePersonalSkillsAndInterestsDto({
        skills: [
          aPersonalSkillDto({ skillType: SkillsValue.WILLINGNESS_TO_LEARN }),
          aPersonalSkillDto({ skillType: SkillsValue.OTHER, skillTypeOther: 'Tenacity' }),
        ],
      }),
    })
    const expected = aValidCreateInductionRequest({
      employabilitySkills: null,
      personalSkillsAndInterests: aCreatePersonalSkillsAndInterestsRequest({
        skills: [
          aPersonalSkill({ skillType: SkillsValue.WILLINGNESS_TO_LEARN }),
          aPersonalSkill({ skillType: SkillsValue.OTHER, skillTypeOther: 'Tenacity' }),
        ],
      }),
    })

    // When
    const actual = toCreateInductionRequest(createInductionDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map a CreateOrUpdateInductionDto to a CreateInductionRequest given a DTO with employability skills instead of personal skills', () => {
    // Given
    const createInductionDto = aValidCreateOrUpdateInductionDto({
      employabilitySkills: [aCreateEmployabilitySkillDto()],
      personalSkillsAndInterests: aCreateOrUpdatePersonalSkillsAndInterestsDto({
        skills: null,
      }),
    })
    const expected = aValidCreateInductionRequest({
      employabilitySkills: [aCreateEmployabilitySkillRequest()],
      personalSkillsAndInterests: aCreatePersonalSkillsAndInterestsRequest({
        skills: null,
      }),
    })

    // When
    const actual = toCreateInductionRequest(createInductionDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
