import type { CreateOrUpdateEducationDto, EducationDto } from 'dto'

const toUpdateEducationDto = (prisonId: string, educationDto: EducationDto): CreateOrUpdateEducationDto => ({
  prisonId,
  reference: educationDto.reference,
  educationLevel: educationDto.educationLevel,
  qualifications: educationDto.qualifications.map(qualification => ({
    reference: qualification.reference,
    subject: qualification.subject,
    level: qualification.level,
    grade: qualification.grade,
  })),
})

export default toUpdateEducationDto
