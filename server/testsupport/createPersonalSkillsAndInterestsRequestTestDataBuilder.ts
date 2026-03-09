import type {
  CreatePersonalSkillsAndInterestsRequest,
  PersonalInterest,
  PersonalSkill,
} from 'educationAndWorkPlanApiClient'
import SkillsValue from '../enums/skillsValue'
import PersonalInterestsValue from '../enums/personalInterestsValue'

const aCreatePersonalSkillsAndInterestsRequest = (options?: {
  interests?: Array<PersonalInterest>
  skills?: Array<PersonalSkill>
}): CreatePersonalSkillsAndInterestsRequest => ({
  interests: options?.interests || [aPersonalInterest()],
  skills: options?.skills === null ? null : options?.skills || [aPersonalSkill()],
})

const aPersonalInterest = (options?: {
  interestType?: PersonalInterestsValue
  interestTypeOther?: string
}): PersonalInterest => ({
  interestType: options?.interestType || PersonalInterestsValue.COMMUNITY,
  interestTypeOther:
    options?.interestType === PersonalInterestsValue.OTHER ? options?.interestTypeOther || 'Renewable energy' : null,
})

const aPersonalSkill = (options?: { skillType?: SkillsValue; skillTypeOther?: string }): PersonalSkill => ({
  skillType: options?.skillType || SkillsValue.COMMUNICATION,
  skillTypeOther: options?.skillType === SkillsValue.OTHER ? options?.skillTypeOther || 'Tenacity' : null,
})

export { aCreatePersonalSkillsAndInterestsRequest, aPersonalInterest, aPersonalSkill }
