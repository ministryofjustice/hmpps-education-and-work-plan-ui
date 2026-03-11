import type { PersonalInterest, PersonalSkill, PersonalSkillsAndInterestsResponse } from 'educationAndWorkPlanApiClient'
import { AuditFields, validAuditFields } from './auditFieldsTestDataBuilder'
import { aPersonalInterest, aPersonalSkill } from './createPersonalSkillsAndInterestsRequestTestDataBuilder'
import SkillsValue from '../enums/skillsValue'
import PersonalInterestsValue from '../enums/personalInterestsValue'

const aPersonalSkillsAndInterestsResponse = (
  options?: AuditFields & {
    interests?: Array<PersonalInterest>
    skills?: Array<PersonalSkill>
  },
): PersonalSkillsAndInterestsResponse => ({
  ...validAuditFields(options),
  interests: options?.interests || [
    aPersonalInterest({ interestType: PersonalInterestsValue.CREATIVE }),
    aPersonalInterest({ interestType: PersonalInterestsValue.DIGITAL }),
    aPersonalInterest({ interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' }),
  ],
  skills:
    options?.skills === null
      ? null
      : options?.skills || [
          aPersonalSkill({ skillType: SkillsValue.TEAMWORK }),
          aPersonalSkill({ skillType: SkillsValue.WILLINGNESS_TO_LEARN }),
          aPersonalSkill({ skillType: SkillsValue.OTHER, skillTypeOther: 'Tenacity' }),
        ],
})

export default aPersonalSkillsAndInterestsResponse
