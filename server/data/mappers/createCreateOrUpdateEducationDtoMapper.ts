import type { CreateOrUpdateEducationDto, EducationDto } from 'dto'

const toCreateEducationDto = (prisonId: string, educationDto: EducationDto): CreateOrUpdateEducationDto => ({
  prisonId,
  educationLevel: educationDto.educationLevel,
  qualifications: educationDto.qualifications.map(qualification => ({
    subject: qualification.subject,
    level: qualification.level,
    grade: qualification.grade,
  })),
})

export default toCreateEducationDto
