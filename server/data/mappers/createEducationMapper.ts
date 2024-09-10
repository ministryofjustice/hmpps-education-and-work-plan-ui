import type { CreateAchievedQualificationRequest, CreateEducationRequest } from 'educationAndWorkPlanApiClient'
import type { AchievedQualificationDto, CreateOrUpdateEducationDto } from 'dto'

const toCreateEducationRequest = (createEducationDto: CreateOrUpdateEducationDto): CreateEducationRequest => ({
  prisonId: createEducationDto.prisonId,
  educationLevel: createEducationDto.educationLevel,
  qualifications: createEducationDto.qualifications.map(toCreateAchievedQualificationRequest),
})

const toCreateAchievedQualificationRequest = (
  achievedQualificationDto: AchievedQualificationDto,
): CreateAchievedQualificationRequest => {
  return {
    subject: achievedQualificationDto.subject,
    level: achievedQualificationDto.level,
    grade: achievedQualificationDto.grade,
  }
}

export default toCreateEducationRequest
