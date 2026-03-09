import type { EmployabilitySkillResponseDto } from 'dto'
import type { InductionDto, PersonalSkillsAndInterestsDto } from 'inductionDto'
import HopingToGetWorkValue from '../enums/hopingToGetWorkValue'
import TypeOfWorkExperienceValue from '../enums/typeOfWorkExperienceValue'
import WorkInterestTypeValue from '../enums/workInterestTypeValue'
import EducationLevelValue from '../enums/educationLevelValue'
import QualificationLevelValue from '../enums/qualificationLevelValue'
import AdditionalTrainingValue from '../enums/additionalTrainingValue'
import InPrisonWorkValue from '../enums/inPrisonWorkValue'
import InPrisonTrainingValue from '../enums/inPrisonTrainingValue'
import AbilityToWorkValue from '../enums/abilityToWorkValue'
import HasWorkedBeforeValue from '../enums/hasWorkedBeforeValue'
import aPersonalSkillsAndInterestsDto from './personalSkillsAndInterestsDtoTestDataBuilder'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'
import { anEmployabilitySkillResponseDto } from './employabilitySkillResponseDtoTestDataBuilder'

const aValidInductionDto = (
  options?: DtoAuditFields & {
    prisonNumber?: string
    hopingToGetWork?: HopingToGetWorkValue
    hasWorkedBefore?: HasWorkedBeforeValue
    hasQualifications?: boolean
    employabilitySkills?: Array<EmployabilitySkillResponseDto>
    personalSkillsAndInterests?: PersonalSkillsAndInterestsDto
  },
): InductionDto => {
  const hasWorkedBefore = options?.hasWorkedBefore || HasWorkedBeforeValue.YES
  return {
    ...baseInductionDtoTemplate(options),
    workOnRelease: {
      ...validDtoAuditFields({ reference: 'bdebe39f-6f85-459b-81be-a26341c3fe3c', ...options }),
      hopingToWork: options?.hopingToGetWork || HopingToGetWorkValue.YES,
      affectAbilityToWork: [
        AbilityToWorkValue.CARING_RESPONSIBILITIES,
        AbilityToWorkValue.NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH,
        AbilityToWorkValue.OTHER,
      ],
      affectAbilityToWorkOther: 'Variable mental health',
    },
    inPrisonInterests: {
      ...validDtoAuditFields({ reference: 'ae6a6a94-df32-4a90-b39d-ff1a100a6da0', ...options }),
      inPrisonWorkInterests: [
        { workType: InPrisonWorkValue.CLEANING_AND_HYGIENE, workTypeOther: null },
        { workType: InPrisonWorkValue.OTHER, workTypeOther: 'Gardening and grounds keeping' },
      ],
      inPrisonTrainingInterests: [
        { trainingType: InPrisonTrainingValue.FORKLIFT_DRIVING, trainingTypeOther: null },
        { trainingType: InPrisonTrainingValue.CATERING, trainingTypeOther: null },
        { trainingType: InPrisonTrainingValue.OTHER, trainingTypeOther: 'Advanced origami' },
      ],
    },
    previousWorkExperiences: {
      ...validDtoAuditFields({ reference: 'bb45462e-8225-490d-8c1c-ad6692223d4d', ...options }),
      hasWorkedBefore,
      hasWorkedBeforeNotRelevantReason:
        hasWorkedBefore === HasWorkedBeforeValue.NOT_RELEVANT ? 'Some reason' : undefined,
      experiences:
        hasWorkedBefore === HasWorkedBeforeValue.YES
          ? [
              {
                experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
                experienceTypeOther: null,
                role: 'General labourer',
                details: 'Groundwork and basic block work and bricklaying',
              },
              {
                experienceType: TypeOfWorkExperienceValue.OTHER,
                experienceTypeOther: 'Retail delivery',
                role: 'Milkman',
                details: 'Self employed franchise operator delivering milk and associated diary products.',
              },
            ]
          : [],
    },
    futureWorkInterests: {
      ...validDtoAuditFields({ reference: 'cad34670-691d-4862-8014-dc08a6f620b9', ...options }),
      interests: [
        {
          workType: WorkInterestTypeValue.RETAIL,
          workTypeOther: null,
          role: null,
        },
        {
          workType: WorkInterestTypeValue.CONSTRUCTION,
          workTypeOther: null,
          role: 'General labourer',
        },
        {
          workType: WorkInterestTypeValue.OTHER,
          workTypeOther: 'Film, TV and media',
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ],
    },
    employabilitySkills:
      options?.employabilitySkills === null
        ? undefined
        : options?.employabilitySkills || [anEmployabilitySkillResponseDto()],
    personalSkillsAndInterests: options?.personalSkillsAndInterests || aPersonalSkillsAndInterestsDto(),
    previousQualifications: {
      ...validDtoAuditFields({ reference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c', ...options }),
      educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      qualifications:
        !options ||
        options.hasQualifications === null ||
        options.hasQualifications === undefined ||
        options.hasQualifications === true
          ? [
              {
                subject: 'Pottery',
                grade: 'C',
                level: QualificationLevelValue.LEVEL_4,
              },
            ]
          : [],
    },
    previousTraining: {
      ...validDtoAuditFields({ reference: 'a8e1fe50-1e3b-4784-a27f-ee1c54fc7616', ...options }),
      trainingTypes: [
        AdditionalTrainingValue.FIRST_AID_CERTIFICATE,
        AdditionalTrainingValue.MANUAL_HANDLING,
        AdditionalTrainingValue.OTHER,
      ],
      trainingTypeOther: 'Advanced origami',
    },
  }
}

const anInductionDtoForAnInductionThatAlreadyExists = (
  options?: DtoAuditFields & {
    prisonNumber?: string
    hopingToGetWork?: HopingToGetWorkValue
    hasWorkedBefore?: HasWorkedBeforeValue
    hasQualifications?: boolean
    employabilitySkills?: Array<EmployabilitySkillResponseDto>
    personalSkillsAndInterests?: PersonalSkillsAndInterestsDto
  },
): InductionDto => {
  const baseInduction = aValidInductionDto(options)
  return {
    ...baseInduction,
    previousQualifications: {
      ...baseInduction.previousQualifications,
      qualifications: baseInduction.previousQualifications.qualifications.map(qualification => ({
        ...qualification,
        reference: 'c83891c9-7676-4332-a80b-e9374f56352a',
        createdBy: options?.createdByDisplayName || 'asmith_gen',
        createdAt: options?.createdAt || new Date('2023-06-19T09:39:44Z'),
        updatedBy: options?.updatedBy || 'asmith_gen',
        updatedAt: options?.updatedAt || new Date('2023-06-19T09:39:44Z'),
      })),
    },
  }
}

const baseInductionDtoTemplate = (options?: DtoAuditFields & { prisonNumber?: string }): InductionDto => {
  return {
    ...validDtoAuditFields({ reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b', ...options }),
    prisonNumber: options?.prisonNumber || 'A1234BC',
    workOnRelease: undefined,
    previousQualifications: undefined,
    previousTraining: undefined,
    previousWorkExperiences: undefined,
    inPrisonInterests: undefined,
    personalSkillsAndInterests: undefined,
    futureWorkInterests: undefined,
  }
}

export { aValidInductionDto, anInductionDtoForAnInductionThatAlreadyExists }
