import aValidInductionResponse from '../../testsupport/inductionResponseTestDataBuilder'
import { anInductionDtoForAnInductionThatAlreadyExists } from '../../testsupport/inductionDtoTestDataBuilder'
import toInductionDto from './inductionDtoMapper'
import aPersonalSkillsAndInterestsResponse from '../../testsupport/personalSkillsAndInterestsResponseTestDataBuilder'
import {
  aPersonalInterest,
  aPersonalSkill,
} from '../../testsupport/createPersonalSkillsAndInterestsRequestTestDataBuilder'
import SkillsValue from '../../enums/skillsValue'
import PersonalInterestsValue from '../../enums/personalInterestsValue'
import aPersonalSkillsAndInterestsDto from '../../testsupport/personalSkillsAndInterestsDtoTestDataBuilder'
import {
  aPersonalInterestDto,
  aPersonalSkillDto,
} from '../../testsupport/createOrUpdatePersonalSkillsAndInterestsDtoTestDataBuilder'
import { aGetEmployabilitySkillsResponse } from '../../testsupport/getEmployabilitySkillResponsesTestDataBuilder'
import { anEmployabilitySkillResponseDto } from '../../testsupport/employabilitySkillResponseDtoTestDataBuilder'

describe('inductionDtoMapper', () => {
  it('should map an InductionResponse to a InductionDto given the InductionResponse has personal skills instead of employability skills', () => {
    // Given
    const inductionResponse = aValidInductionResponse({
      employabilitySkills: null,
      personalSkillsAndInterests: aPersonalSkillsAndInterestsResponse({
        reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
        skills: [aPersonalSkill({ skillType: SkillsValue.TEAMWORK })],
        interests: [aPersonalInterest({ interestType: PersonalInterestsValue.CREATIVE })],
      }),
    })
    const expected = anInductionDtoForAnInductionThatAlreadyExists({
      employabilitySkills: [],
      personalSkillsAndInterests: aPersonalSkillsAndInterestsDto({
        reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
        skills: [aPersonalSkillDto({ skillType: SkillsValue.TEAMWORK })],
        interests: [aPersonalInterestDto({ interestType: PersonalInterestsValue.CREATIVE })],
      }),
    })

    // When
    const actual = toInductionDto(inductionResponse)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map an InductionResponse to a InductionDto given the InductionResponse has employability skills instead of personal skills', () => {
    // Given
    const inductionResponse = aValidInductionResponse({
      employabilitySkills: [aGetEmployabilitySkillsResponse()],
      personalSkillsAndInterests: aPersonalSkillsAndInterestsResponse({
        reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
        skills: null,
        interests: [aPersonalInterest({ interestType: PersonalInterestsValue.CREATIVE })],
      }),
    })
    const expected = anInductionDtoForAnInductionThatAlreadyExists({
      employabilitySkills: [anEmployabilitySkillResponseDto()],
      personalSkillsAndInterests: aPersonalSkillsAndInterestsDto({
        reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
        skills: null,
        interests: [aPersonalInterestDto({ interestType: PersonalInterestsValue.CREATIVE })],
      }),
    })

    // When
    const actual = toInductionDto(inductionResponse)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should not map to InductionDto given undefined InductionResponse', () => {
    // Given

    // When
    const actual = toInductionDto(undefined)

    // Then
    expect(actual).toBeUndefined()
  })
})
