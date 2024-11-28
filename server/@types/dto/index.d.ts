declare module 'dto' {
  import ReasonToArchiveGoalValue from '../../enums/ReasonToArchiveGoalValue'
  import EducationLevelValue from '../../enums/educationLevelValue'
  import QualificationLevelValue from '../../enums/qualificationLevelValue'
  import ReviewPlanCompletedByValue from '../../enums/reviewPlanCompletedByValue'

  export interface CreateGoalDto {
    prisonNumber: string
    title: string
    steps: Array<AddStepDto>
    targetCompletionDate: Date
    note?: string
    prisonId: string
  }

  export interface AddStepDto {
    title: string
    sequenceNumber: number
  }

  export interface UpdateGoalDto {
    goalReference: string
    title: string
    steps: Array<UpdateStepDto>
    targetCompletionDate: Date
    notes?: string
    prisonId: string
  }

  export interface UpdateStepDto {
    stepReference: string
    status: string
    title: string
    sequenceNumber: number
  }

  export interface ArchiveGoalDto {
    goalReference: string
    prisonNumber: string
    reason: ReasonToArchiveGoalValue
    reasonOther?: string
    notes?: string
  }

  export interface UnarchiveGoalDto {
    goalReference: string
    prisonNumber: string
  }

  export interface CompleteGoalDto {
    goalReference: string
    prisonNumber: string
    note: string
  }
  export interface EducationDto extends ReferencedAndAuditable {
    prisonNumber: string
    educationLevel: EducationLevelValue
    qualifications: Array<AchievedQualificationDto>
  }

  export interface AchievedQualificationDto {
    subject: string
    level: QualificationLevelValue
    grade: string
    reference?: string
    createdBy?: string
    createdAt?: Date
    updatedBy?: string
    updatedAt?: Date
  }

  export interface CreateOrUpdateEducationDto {
    reference?: string
    prisonId: string
    educationLevel: EducationLevelValue
    qualifications: Array<AchievedQualificationDto>
  }

  export interface ReviewPlanDto {
    prisonNumber: string
    prisonId: string
    completedBy: ReviewPlanCompletedByValue
    completedByOtherFullName?: string
    completedByOtherJobRole?: string
    reviewDate: Date
    notes?: string
    wasLastReviewBeforeRelease?: boolean
    nextReviewDateFrom?: Date
    nextReviewDateTo?: Date
  }

  export interface ReviewExemptionDto {
    exemptionReason: ReviewPlanExemptionReasonValue
    exemptionReasonDetails: string
  }
}

declare module 'inductionDto' {
  import type { AchievedQualificationDto } from 'dto'
  import HasWorkedBeforeValue from '../../enums/hasWorkedBeforeValue'

  export interface InductionDto extends ReferencedAndAuditable {
    prisonNumber: string
    workOnRelease: WorkOnReleaseDto
    previousQualifications?: PreviousQualificationsDto
    previousTraining?: PreviousTrainingDto
    previousWorkExperiences?: PreviousWorkExperiencesDto
    inPrisonInterests?: InPrisonInterestsDto
    personalSkillsAndInterests?: PersonalSkillsAndInterestsDto
    futureWorkInterests?: FutureWorkInterestsDto
  }

  export interface WorkOnReleaseDto extends ReferencedAndAuditable {
    hopingToWork: HopingToGetWorkValue
    affectAbilityToWork: AbilityToWorkValue[]
    affectAbilityToWorkOther?: string
  }

  export interface PreviousQualificationsDto extends ReferencedAndAuditable {
    educationLevel: EducationLevelValue
    qualifications: Array<AchievedQualificationDto>
  }

  export interface PreviousTrainingDto extends ReferencedAndAuditable {
    trainingTypes: AdditionalTrainingValue[]
    trainingTypeOther?: string
  }

  export interface PreviousWorkExperiencesDto extends ReferencedAndAuditable {
    hasWorkedBefore: HasWorkedBeforeValue
    hasWorkedBeforeNotRelevantReason?: string
    experiences: Array<PreviousWorkExperienceDto>
  }

  export interface InPrisonInterestsDto extends ReferencedAndAuditable {
    inPrisonWorkInterests: Array<InPrisonWorkInterestDto>
    inPrisonTrainingInterests: Array<InPrisonTrainingInterestDto>
  }

  export interface PersonalSkillsAndInterestsDto extends ReferencedAndAuditable {
    skills: Array<PersonalSkillDto>
    interests: Array<PersonalInterestDto>
  }

  export interface FutureWorkInterestsDto extends ReferencedAndAuditable {
    interests: Array<FutureWorkInterestDto>
  }

  export interface CreateOrUpdateInductionDto {
    reference?: string
    prisonId: string
    workOnRelease: CreateOrUpdateWorkOnReleaseDto
    previousQualifications?: CreateOrUpdatePreviousQualificationsDto
    previousTraining?: CreateOrUpdatePreviousTrainingDto
    previousWorkExperiences?: CreateOrUpdatePreviousWorkExperiencesDto
    inPrisonInterests?: CreateOrUpdateInPrisonInterestsDto
    personalSkillsAndInterests?: CreateOrUpdatePersonalSkillsAndInterestsDto
    futureWorkInterests?: CreateOrUpdateFutureWorkInterestsDto
  }

  export interface CreateOrUpdateWorkOnReleaseDto {
    reference?: string
    hopingToWork: HopingToGetWorkValue
    affectAbilityToWork?: AbilityToWorkValue[]
    affectAbilityToWorkOther?: string
  }

  export interface CreateOrUpdatePreviousQualificationsDto {
    reference?: string
    educationLevel?: EducationLevelValue
    qualifications?: AchievedQualificationDto[]
  }

  export interface CreateOrUpdatePreviousTrainingDto {
    reference?: string
    trainingTypes: AdditionalTrainingValue[]
    trainingTypeOther?: string
  }

  export interface CreateOrUpdatePreviousWorkExperiencesDto {
    reference?: string
    hasWorkedBefore: HasWorkedBeforeValue
    hasWorkedBeforeNotRelevantReason?: string
    experiences?: PreviousWorkExperienceDto[]
  }

  export interface CreateOrUpdateInPrisonInterestsDto {
    reference?: string
    inPrisonWorkInterests: InPrisonWorkInterestDto[]
    inPrisonTrainingInterests: InPrisonTrainingInterestDto[]
  }

  export interface CreateOrUpdatePersonalSkillsAndInterestsDto {
    reference?: string
    skills: PersonalSkillDto[]
    interests: PersonalInterestDto[]
  }

  export interface CreateOrUpdateFutureWorkInterestsDto {
    reference?: string
    interests: FutureWorkInterestDto[]
  }

  export interface PreviousWorkExperienceDto {
    experienceType: TypeOfWorkExperienceValue
    experienceTypeOther?: string
    role?: string
    details?: string
  }

  export interface InPrisonWorkInterestDto {
    workType: InPrisonWorkValue
    workTypeOther?: string
  }

  export interface InPrisonTrainingInterestDto {
    trainingType: InPrisonTrainingValue
    trainingTypeOther?: string
  }

  export interface PersonalSkillDto {
    skillType: SkillsValue
    skillTypeOther?: string
  }

  export interface PersonalInterestDto {
    interestType: PersonalInterestsValue
    interestTypeOther?: string
  }

  export interface FutureWorkInterestDto {
    workType: WorkInterestTypeValue
    workTypeOther?: string
    role?: string
  }
}

/**
 * Interface defining common reference and audit related properties that DTO types can inherit through extension.
 */
interface ReferencedAndAuditable {
  reference: string
  createdBy: string
  createdByDisplayName: string
  createdAt: Date
  createdAtPrison: string
  updatedBy: string
  updatedByDisplayName: string
  updatedAt: Date
  updatedAtPrison: string
}
