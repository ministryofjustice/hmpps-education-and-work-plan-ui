import type { AchievedQualificationDto, CreateOrUpdateEducationDto } from 'dto'
import EducationLevelValue from '../enums/educationLevelValue'
import { aNewAchievedQualificationDto } from './achievedQualificationDtoTestDataBuilder'

const aValidCreateEducationDto = (options?: {
  prisonId?: string
  educationLevel?: EducationLevelValue
  qualifications?: Array<AchievedQualificationDto>
}): CreateOrUpdateEducationDto => ({
  prisonId: options?.prisonId || 'BXI',
  educationLevel: options?.educationLevel || EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
  qualifications: options?.qualifications || [aNewAchievedQualificationDto()],
})

export default aValidCreateEducationDto
