import type { CreateOrUpdateAchievedQualificationRequest, UpdateEducationRequest } from 'educationAndWorkPlanApiClient'
import type { AchievedQualificationDto, CreateOrUpdateEducationDto } from 'dto'

const toUpdateEducationRequest = (updateEducationDto: CreateOrUpdateEducationDto): UpdateEducationRequest => ({
  reference: updateEducationDto.reference,
  prisonId: updateEducationDto.prisonId,
  educationLevel: updateEducationDto.educationLevel,
  qualifications: updateEducationDto.qualifications.map(toUpdateAchievedQualificationRequest),
})

const toUpdateAchievedQualificationRequest = (
  achievedQualificationDto: AchievedQualificationDto,
): CreateOrUpdateAchievedQualificationRequest => {
  return {
    reference: achievedQualificationDto.reference,
    subject: achievedQualificationDto.subject,
    level: achievedQualificationDto.level,
    grade: achievedQualificationDto.grade,
  }
}

export default toUpdateEducationRequest
