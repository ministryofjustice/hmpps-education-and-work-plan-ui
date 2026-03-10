import type { PersonalInterestDto, PersonalSkillDto, PersonalSkillsAndInterestsDto } from 'inductionDto'
import { aPersonalInterestDto, aPersonalSkillDto } from './createOrUpdatePersonalSkillsAndInterestsDtoTestDataBuilder'
import SkillsValue from '../enums/skillsValue'
import PersonalInterestsValue from '../enums/personalInterestsValue'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'

const aPersonalSkillsAndInterestsDto = (
  options?: DtoAuditFields & {
    interests?: Array<PersonalInterestDto>
    skills?: Array<PersonalSkillDto>
  },
): PersonalSkillsAndInterestsDto => ({
  ...validDtoAuditFields({ reference: '517c470f-f9b5-4d49-9148-4458fe358439', ...options }),
  skills:
    options?.skills === null
      ? null
      : options?.skills || [
          aPersonalSkillDto({ skillType: SkillsValue.TEAMWORK }),
          aPersonalSkillDto({ skillType: SkillsValue.WILLINGNESS_TO_LEARN }),
          aPersonalSkillDto({ skillType: SkillsValue.OTHER, skillTypeOther: 'Tenacity' }),
        ],
  interests: options?.interests || [
    aPersonalInterestDto({ interestType: PersonalInterestsValue.CREATIVE }),
    aPersonalInterestDto({ interestType: PersonalInterestsValue.DIGITAL }),
    aPersonalInterestDto({ interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' }),
  ],
})

export default aPersonalSkillsAndInterestsDto
