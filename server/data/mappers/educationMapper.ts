import { parseISO } from 'date-fns'
import type { AchievedQualificationResponse, EducationResponse } from 'educationAndWorkPlanApiClient'
import type { EducationDto, AchievedQualificationDto } from 'dto'
import EducationLevelValue from '../../enums/educationLevelValue'
import QualificationLevelValue from '../../enums/qualificationLevelValue'

const toEducationDto = (educationResponse: EducationResponse, prisonNumber: string): EducationDto => {
  return {
    prisonNumber,
    educationLevel: EducationLevelValue[educationResponse.educationLevel as keyof typeof EducationLevelValue],
    qualifications: educationResponse.qualifications.map(toQualificationDto),
    reference: educationResponse.reference,
    createdBy: educationResponse.createdBy,
    createdByDisplayName: educationResponse.createdByDisplayName,
    createdAt: parseISO(educationResponse.createdAt),
    createdAtPrison: educationResponse.createdAtPrison,
    updatedBy: educationResponse.updatedBy,
    updatedByDisplayName: educationResponse.updatedByDisplayName,
    updatedAt: parseISO(educationResponse.updatedAt),
    updatedAtPrison: educationResponse.updatedAtPrison,
  }
}

const toQualificationDto = (achievedQualificationResponse: AchievedQualificationResponse): AchievedQualificationDto => {
  return {
    subject: achievedQualificationResponse.subject,
    level: QualificationLevelValue[achievedQualificationResponse.level as keyof typeof QualificationLevelValue],
    grade: achievedQualificationResponse.grade,
    reference: achievedQualificationResponse.reference,
    createdBy: achievedQualificationResponse.createdBy,
    createdAt: parseISO(achievedQualificationResponse.createdAt),
    updatedBy: achievedQualificationResponse.updatedBy,
    updatedAt: parseISO(achievedQualificationResponse.updatedAt),
  }
}

export default toEducationDto
