import type { AchievedQualificationResponse, InductionResponse } from 'educationAndWorkPlanApiClient'
import type { InductionDto } from 'inductionDto'
import QualificationLevelValue from '../../enums/qualificationLevelValue'
import HasWorkedBeforeValue from '../../enums/hasWorkedBeforeValue'

const toInductionDto = (inductionResponse: InductionResponse): InductionDto => {
  if (!inductionResponse) {
    return undefined
  }
  return {
    ...inductionResponse,
    createdAt: new Date(inductionResponse.createdAt),
    updatedAt: new Date(inductionResponse.updatedAt),
    workOnRelease: {
      ...inductionResponse.workOnRelease,
      createdAt: new Date(inductionResponse.workOnRelease.createdAt),
      updatedAt: new Date(inductionResponse.workOnRelease.updatedAt),
    },
    previousQualifications: inductionResponse.previousQualifications
      ? {
          ...inductionResponse.previousQualifications,
          qualifications: inductionResponse.previousQualifications.qualifications.map(
            (qualification: AchievedQualificationResponse) => ({
              ...qualification,
              level: qualification.level as QualificationLevelValue,
              createdAt: new Date(qualification.createdAt),
              updatedAt: new Date(qualification.updatedAt),
            }),
          ),
          createdAt: new Date(inductionResponse.previousQualifications.createdAt),
          updatedAt: new Date(inductionResponse.previousQualifications.updatedAt),
        }
      : undefined,
    previousTraining: inductionResponse.previousTraining
      ? {
          ...inductionResponse.previousTraining,
          createdAt: new Date(inductionResponse.previousTraining.createdAt),
          updatedAt: new Date(inductionResponse.previousTraining.updatedAt),
        }
      : undefined,
    previousWorkExperiences: inductionResponse.previousWorkExperiences
      ? {
          ...inductionResponse.previousWorkExperiences,
          hasWorkedBefore: inductionResponse.previousWorkExperiences.hasWorkedBefore as HasWorkedBeforeValue,
          createdAt: new Date(inductionResponse.previousWorkExperiences.createdAt),
          updatedAt: new Date(inductionResponse.previousWorkExperiences.updatedAt),
        }
      : undefined,
    inPrisonInterests: inductionResponse.inPrisonInterests
      ? {
          ...inductionResponse.inPrisonInterests,
          createdAt: new Date(inductionResponse.inPrisonInterests.createdAt),
          updatedAt: new Date(inductionResponse.inPrisonInterests.updatedAt),
        }
      : undefined,
    personalSkillsAndInterests: inductionResponse.personalSkillsAndInterests
      ? {
          ...inductionResponse.personalSkillsAndInterests,
          createdAt: new Date(inductionResponse.personalSkillsAndInterests.createdAt),
          updatedAt: new Date(inductionResponse.personalSkillsAndInterests.updatedAt),
        }
      : undefined,
    futureWorkInterests: inductionResponse.futureWorkInterests
      ? {
          ...inductionResponse.futureWorkInterests,
          createdAt: new Date(inductionResponse.futureWorkInterests.createdAt),
          updatedAt: new Date(inductionResponse.futureWorkInterests.updatedAt),
        }
      : undefined,
  }
}

export default toInductionDto
