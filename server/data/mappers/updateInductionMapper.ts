import type { UpdateInductionRequest } from 'educationAndWorkPlanApiClient'
import type { CreateOrUpdateInductionDto } from 'inductionDto'

function toUpdateInductionRequest(updateInductionDto: CreateOrUpdateInductionDto): UpdateInductionRequest {
  return {
    reference: updateInductionDto.reference,
    prisonId: updateInductionDto.prisonId,
    workOnRelease: updateInductionDto.workOnRelease,
    previousQualifications: updateInductionDto.previousQualifications,
    previousTraining: updateInductionDto.previousTraining,
    previousWorkExperiences: updateInductionDto.previousWorkExperiences,
    inPrisonInterests: updateInductionDto.inPrisonInterests,
    personalSkillsAndInterests: updateInductionDto.personalSkillsAndInterests,
    futureWorkInterests: updateInductionDto.futureWorkInterests,
  } as UpdateInductionRequest
}

export default toUpdateInductionRequest
