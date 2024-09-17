import type { AchievedQualificationDto, CreateOrUpdateEducationDto } from 'dto'
import EducationLevelValue from '../enums/educationLevelValue'
import { anUpdateAchievedQualificationDto } from './achievedQualificationDtoTestDataBuilder'

const aValidUpdateEducationDto = (options?: {
  reference?: string
  prisonId?: string
  educationLevel?: EducationLevelValue
  qualifications?: Array<AchievedQualificationDto>
}): CreateOrUpdateEducationDto => ({
  reference: options?.reference || 'bcabb7ec-893e-4b0b-b999-6ff883fd8c6b',
  prisonId: options?.prisonId || 'BXI',
  educationLevel: options?.educationLevel || EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
  qualifications: options?.qualifications || [anUpdateAchievedQualificationDto()],
})

export default aValidUpdateEducationDto
