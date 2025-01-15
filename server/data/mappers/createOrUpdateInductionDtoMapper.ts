import { format } from 'date-fns'
import type {
  CreateOrUpdateFutureWorkInterestsDto,
  CreateOrUpdateInductionDto,
  CreateOrUpdateInPrisonInterestsDto,
  CreateOrUpdatePersonalSkillsAndInterestsDto,
  CreateOrUpdatePreviousQualificationsDto,
  CreateOrUpdatePreviousTrainingDto,
  CreateOrUpdatePreviousWorkExperiencesDto,
  CreateOrUpdateWorkOnReleaseDto,
  FutureWorkInterestsDto,
  InductionDto,
  InPrisonInterestsDto,
  PersonalSkillsAndInterestsDto,
  PreviousQualificationsDto,
  PreviousTrainingDto,
  PreviousWorkExperiencesDto,
  WorkOnReleaseDto,
} from 'inductionDto'
import SessionCompletedByValue from '../../enums/sessionCompletedByValue'

const toCreateOrUpdateInductionDto = (prisonId: string, inductionDto: InductionDto): CreateOrUpdateInductionDto => {
  return {
    reference: inductionDto.reference,
    prisonId,
    workOnRelease: toCreateOrUpdateWorkOnReleaseDto(inductionDto.workOnRelease),
    previousQualifications: toCreateOrUpdatePreviousQualificationsDto(inductionDto.previousQualifications),
    previousTraining: toCreateOrUpdatePreviousTrainingDto(inductionDto.previousTraining),
    previousWorkExperiences: toCreateOrUpdatePreviousWorkExperiencesDto(inductionDto.previousWorkExperiences),
    inPrisonInterests: toCreateOrUpdateInPrisonInterestsDto(inductionDto.inPrisonInterests),
    personalSkillsAndInterests: toCreateOrUpdatePersonalSkillsAndInterestsDto(inductionDto.personalSkillsAndInterests),
    futureWorkInterests: toCreateOrUpdateFutureWorkInterestsDto(inductionDto.futureWorkInterests),
    conductedAt: inductionDto.inductionDate ? format(inductionDto.inductionDate, 'yyyy-MM-dd') : undefined,
    conductedBy:
      inductionDto.completedBy === SessionCompletedByValue.SOMEBODY_ELSE
        ? inductionDto.completedByOtherFullName
        : undefined,
    conductedByRole:
      inductionDto.completedBy === SessionCompletedByValue.SOMEBODY_ELSE
        ? inductionDto.completedByOtherJobRole
        : undefined,
    note: inductionDto.notes,
  }
}

const toCreateOrUpdateWorkOnReleaseDto = (workOnRelease: WorkOnReleaseDto): CreateOrUpdateWorkOnReleaseDto => {
  return {
    reference: workOnRelease.reference,
    hopingToWork: workOnRelease.hopingToWork,
    affectAbilityToWork: workOnRelease.affectAbilityToWork,
    affectAbilityToWorkOther: workOnRelease.affectAbilityToWorkOther,
  }
}

const toCreateOrUpdatePreviousQualificationsDto = (
  previousQualifications: PreviousQualificationsDto,
): CreateOrUpdatePreviousQualificationsDto => {
  return previousQualifications
    ? {
        reference: previousQualifications.reference,
        educationLevel: previousQualifications.educationLevel,
        qualifications: previousQualifications.qualifications,
      }
    : undefined
}

const toCreateOrUpdatePreviousTrainingDto = (
  previousTraining: PreviousTrainingDto,
): CreateOrUpdatePreviousTrainingDto => {
  return previousTraining
    ? {
        reference: previousTraining.reference,
        trainingTypes: previousTraining.trainingTypes,
        trainingTypeOther: previousTraining.trainingTypeOther,
      }
    : undefined
}

const toCreateOrUpdatePreviousWorkExperiencesDto = (
  previousWorkExperiences: PreviousWorkExperiencesDto,
): CreateOrUpdatePreviousWorkExperiencesDto => {
  return previousWorkExperiences
    ? {
        reference: previousWorkExperiences.reference,
        hasWorkedBefore: previousWorkExperiences.hasWorkedBefore,
        hasWorkedBeforeNotRelevantReason: previousWorkExperiences.hasWorkedBeforeNotRelevantReason,
        experiences: previousWorkExperiences.experiences,
      }
    : undefined
}

const toCreateOrUpdateInPrisonInterestsDto = (
  inPrisonInterests: InPrisonInterestsDto,
): CreateOrUpdateInPrisonInterestsDto => {
  return {
    reference: inPrisonInterests?.reference,
    inPrisonWorkInterests: inPrisonInterests?.inPrisonWorkInterests || [],
    inPrisonTrainingInterests: inPrisonInterests?.inPrisonTrainingInterests || [],
  }
}

const toCreateOrUpdatePersonalSkillsAndInterestsDto = (
  personalSkillsAndInterests: PersonalSkillsAndInterestsDto,
): CreateOrUpdatePersonalSkillsAndInterestsDto => {
  return {
    reference: personalSkillsAndInterests?.reference,
    skills: personalSkillsAndInterests?.skills || [],
    interests: personalSkillsAndInterests?.interests || [],
  }
}

const toCreateOrUpdateFutureWorkInterestsDto = (
  futureWorkInterests: FutureWorkInterestsDto,
): CreateOrUpdateFutureWorkInterestsDto => {
  return futureWorkInterests
    ? {
        reference: futureWorkInterests.reference,
        interests: futureWorkInterests.interests,
      }
    : undefined
}

export default toCreateOrUpdateInductionDto
