import type { InductionDto } from 'inductionDto'
import ReasonNotToGetWorkValue from '../enums/reasonNotToGetWorkValue'
import HopingToGetWorkValue from '../enums/hopingToGetWorkValue'
import TypeOfWorkExperienceValue from '../enums/typeOfWorkExperienceValue'
import WorkInterestTypeValue from '../enums/workInterestTypeValue'
import SkillsValue from '../enums/skillsValue'
import PersonalInterestsValue from '../enums/personalInterestsValue'
import EducationLevelValue from '../enums/educationLevelValue'
import QualificationLevelValue from '../enums/qualificationLevelValue'
import AdditionalTrainingValue from '../enums/additionalTrainingValue'
import InPrisonWorkValue from '../enums/inPrisonWorkValue'
import InPrisonEducationValue from '../enums/inPrisonEducationValue'
import AbilityToWorkValue from '../enums/abilityToWorkValue'

const aLongQuestionSetInductionDto = (
  options?: CoreBuilderOptions & {
    hasWorkedBefore?: boolean
    hasSkills?: boolean
    hasInterests?: boolean
  },
): InductionDto => {
  return {
    ...baseInductionDtoTemplate(options),
    workOnRelease: {
      reference: 'bdebe39f-6f85-459b-81be-a26341c3fe3c',
      ...auditFields(options),
      hopingToWork: HopingToGetWorkValue.YES,
      affectAbilityToWork: [
        AbilityToWorkValue.CARING_RESPONSIBILITIES,
        AbilityToWorkValue.HEALTH_ISSUES,
        AbilityToWorkValue.OTHER,
      ],
      affectAbilityToWorkOther: 'Variable mental health',
      notHopingToWorkReasons: null,
      notHopingToWorkOtherReason: null,
    },
    previousWorkExperiences: {
      reference: 'bb45462e-8225-490d-8c1c-ad6692223d4d',
      ...auditFields(options),
      hasWorkedBefore:
        !options || options.hasWorkedBefore === null || options.hasWorkedBefore === undefined
          ? true
          : options.hasWorkedBefore,
      experiences:
        !options ||
        options.hasWorkedBefore === null ||
        options.hasWorkedBefore === undefined ||
        options.hasWorkedBefore === true
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
      reference: 'cad34670-691d-4862-8014-dc08a6f620b9',
      ...auditFields(options),
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
    personalSkillsAndInterests: {
      reference: '517c470f-f9b5-4d49-9148-4458fe358439',
      ...auditFields(options),
      skills:
        !options || options.hasSkills === null || options.hasSkills === undefined || options.hasSkills === true
          ? [
              { skillType: SkillsValue.TEAMWORK, skillTypeOther: null },
              { skillType: SkillsValue.WILLINGNESS_TO_LEARN, skillTypeOther: null },
              { skillType: SkillsValue.OTHER, skillTypeOther: 'Tenacity' },
            ]
          : [],
      interests:
        !options || options.hasInterests === null || options.hasInterests === undefined || options.hasInterests === true
          ? [
              { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: null },
              { interestType: PersonalInterestsValue.DIGITAL, interestTypeOther: null },
              { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
            ]
          : [],
    },
    previousQualifications: {
      reference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
      ...auditFields(options),
      educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      qualifications: [
        {
          subject: 'Pottery',
          grade: 'C',
          level: QualificationLevelValue.LEVEL_4,
        },
      ],
    },
    previousTraining: {
      reference: 'a8e1fe50-1e3b-4784-a27f-ee1c54fc7616',
      ...auditFields(options),
      trainingTypes: [
        AdditionalTrainingValue.FIRST_AID_CERTIFICATE,
        AdditionalTrainingValue.MANUAL_HANDLING,
        AdditionalTrainingValue.OTHER,
      ],
      trainingTypeOther: 'Advanced origami',
    },
  }
}

const aShortQuestionSetInductionDto = (
  options?: CoreBuilderOptions & {
    hopingToGetWork?: HopingToGetWorkValue.NO | HopingToGetWorkValue.NOT_SURE
  },
): InductionDto => {
  return {
    ...baseInductionDtoTemplate(options),
    workOnRelease: {
      reference: 'bdebe39f-6f85-459b-81be-a26341c3fe3c',
      ...auditFields(options),
      hopingToWork: options?.hopingToGetWork || HopingToGetWorkValue.NO,
      affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
      affectAbilityToWorkOther: 'Variable mental health',
      notHopingToWorkReasons: [ReasonNotToGetWorkValue.HEALTH, ReasonNotToGetWorkValue.OTHER],
      notHopingToWorkOtherReason: 'Will be of retirement age at release',
    },
    inPrisonInterests: {
      reference: 'ae6a6a94-df32-4a90-b39d-ff1a100a6da0',
      ...auditFields(options),
      inPrisonWorkInterests: [
        { workType: InPrisonWorkValue.CLEANING_AND_HYGIENE, workTypeOther: null },
        { workType: InPrisonWorkValue.OTHER, workTypeOther: 'Gardening and grounds keeping' },
      ],
      inPrisonTrainingInterests: [
        { trainingType: InPrisonEducationValue.FORKLIFT_DRIVING, trainingTypeOther: null },
        { trainingType: InPrisonEducationValue.CATERING, trainingTypeOther: null },
        { trainingType: InPrisonEducationValue.OTHER, trainingTypeOther: 'Advanced origami' },
      ],
    },
    previousQualifications: {
      reference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
      ...auditFields(options),
      educationLevel: null,
      qualifications: [
        {
          subject: 'English',
          grade: 'C',
          level: QualificationLevelValue.LEVEL_6,
        },
        {
          subject: 'Maths',
          grade: 'A*',
          level: QualificationLevelValue.LEVEL_6,
        },
      ],
    },
    previousTraining: {
      reference: 'a8e1fe50-1e3b-4784-a27f-ee1c54fc7616',
      ...auditFields(options),
      trainingTypes: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
      trainingTypeOther: 'Beginners cookery for IT professionals',
    },
  }
}

type CoreBuilderOptions = {
  prisonNumber?: string
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: Date
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: Date
  updatedAtPrison?: string
}

const baseInductionDtoTemplate = (options?: CoreBuilderOptions): InductionDto => {
  return {
    reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
    prisonNumber: options?.prisonNumber || 'A1234BC',
    ...auditFields(options),
    workOnRelease: undefined,
    previousQualifications: undefined,
    previousTraining: undefined,
    previousWorkExperiences: undefined,
    inPrisonInterests: undefined,
    personalSkillsAndInterests: undefined,
    futureWorkInterests: undefined,
  }
}

const auditFields = (
  options?: CoreBuilderOptions,
): {
  createdBy: string
  createdByDisplayName: string
  createdAt: Date
  createdAtPrison: string
  updatedBy: string
  updatedByDisplayName: string
  updatedAt: Date
  updatedAtPrison: string
} => {
  return {
    createdBy: options?.createdByDisplayName || 'asmith_gen',
    createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
    createdAt: options?.createdAt || new Date('2023-06-19T09:39:44Z'),
    createdAtPrison: options?.createdAtPrison || 'MDI',
    updatedBy: options?.updatedBy || 'asmith_gen',
    updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
    updatedAt: options?.updatedAt || new Date('2023-06-19T09:39:44Z'),
    updatedAtPrison: options?.updatedAtPrison || 'MDI',
  }
}

export { aLongQuestionSetInductionDto, aShortQuestionSetInductionDto }
