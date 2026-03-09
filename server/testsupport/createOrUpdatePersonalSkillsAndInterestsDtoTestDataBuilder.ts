import type { CreateOrUpdatePersonalSkillsAndInterestsDto, PersonalInterestDto, PersonalSkillDto } from 'inductionDto'
import SkillsValue from '../enums/skillsValue'
import PersonalInterestsValue from '../enums/personalInterestsValue'

const aCreateOrUpdatePersonalSkillsAndInterestsDto = (options?: {
  interests?: Array<PersonalInterestDto>
  skills?: Array<PersonalSkillDto>
}): CreateOrUpdatePersonalSkillsAndInterestsDto => ({
  interests: options?.interests || [aPersonalInterestDto()],
  skills: options?.skills === null ? null : options?.skills || [aPersonalSkillDto()],
})

const aPersonalInterestDto = (options?: {
  interestType?: PersonalInterestsValue
  interestTypeOther?: string
}): PersonalInterestDto => ({
  interestType: options?.interestType || PersonalInterestsValue.COMMUNITY,
  interestTypeOther:
    options?.interestType === PersonalInterestsValue.OTHER ? options?.interestTypeOther || 'Renewable energy' : null,
})

const aPersonalSkillDto = (options?: { skillType?: SkillsValue; skillTypeOther?: string }): PersonalSkillDto => ({
  skillType: options?.skillType || SkillsValue.COMMUNICATION,
  skillTypeOther: options?.skillType === SkillsValue.OTHER ? options?.skillTypeOther || 'Tenacity' : null,
})

export { aCreateOrUpdatePersonalSkillsAndInterestsDto, aPersonalInterestDto, aPersonalSkillDto }
