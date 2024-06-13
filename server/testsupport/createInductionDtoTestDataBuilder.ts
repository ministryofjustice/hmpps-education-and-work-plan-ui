import type { CreateOrUpdateInductionDto } from 'inductionDto'
import ReasonNotToGetWorkValue from '../enums/reasonNotToGetWorkValue'
import HopingToGetWorkValue from '../enums/hopingToGetWorkValue'
import AbilityToWorkValue from '../enums/abilityToWorkValue'
import TypeOfWorkExperienceValue from '../enums/typeOfWorkExperienceValue'
import WorkInterestTypeValue from '../enums/workInterestTypeValue'
import SkillsValue from '../enums/skillsValue'
import PersonalInterestsValue from '../enums/personalInterestsValue'
import EducationLevelValue from '../enums/educationLevelValue'
import QualificationLevelValue from '../enums/qualificationLevelValue'
import AdditionalTrainingValue from '../enums/additionalTrainingValue'
import InPrisonWorkValue from '../enums/inPrisonWorkValue'
import InPrisonTrainingValue from '../enums/inPrisonTrainingValue'
import HasWorkedBeforeValue from '../enums/hasWorkedBeforeValue'

const aLongQuestionSetCreateInductionDto = (
  options?: CoreBuilderOptions & {
    hasWorkedBefore?: HasWorkedBeforeValue
    hasSkills?: boolean
    hasInterests?: boolean
  },
): CreateOrUpdateInductionDto => {
  return {
    ...baseCreateInductionDtoTemplate(options),
    workOnRelease: {
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
      hasWorkedBefore:
        !options || options.hasWorkedBefore === null || options.hasWorkedBefore === undefined
          ? HasWorkedBeforeValue.YES
          : options.hasWorkedBefore,
      experiences:
        !options ||
        options.hasWorkedBefore === null ||
        options.hasWorkedBefore === undefined ||
        options.hasWorkedBefore === HasWorkedBeforeValue.YES
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
      trainingTypes: [
        AdditionalTrainingValue.FIRST_AID_CERTIFICATE,
        AdditionalTrainingValue.MANUAL_HANDLING,
        AdditionalTrainingValue.OTHER,
      ],
      trainingTypeOther: 'Advanced origami',
    },
  }
}

const aShortQuestionSetCreateInductionDto = (
  options?: CoreBuilderOptions & {
    hopingToGetWork?: HopingToGetWorkValue.NO | HopingToGetWorkValue.NOT_SURE
  },
): CreateOrUpdateInductionDto => {
  return {
    ...baseCreateInductionDtoTemplate(options),
    workOnRelease: {
      hopingToWork: options?.hopingToGetWork || HopingToGetWorkValue.NO,
      affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
      affectAbilityToWorkOther: 'Variable mental health',
      notHopingToWorkReasons: [ReasonNotToGetWorkValue.HEALTH, ReasonNotToGetWorkValue.OTHER],
      notHopingToWorkOtherReason: 'Will be of retirement age at release',
    },
    inPrisonInterests: {
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
    previousQualifications: {
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
      trainingTypes: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
      trainingTypeOther: 'Beginners cookery for IT professionals',
    },
  }
}

type CoreBuilderOptions = {
  prisonId?: string
}

const baseCreateInductionDtoTemplate = (options?: CoreBuilderOptions): CreateOrUpdateInductionDto => {
  return {
    prisonId: options?.prisonId || 'MDI',
    workOnRelease: undefined,
    previousQualifications: undefined,
    previousTraining: undefined,
    previousWorkExperiences: undefined,
    inPrisonInterests: undefined,
    personalSkillsAndInterests: undefined,
    futureWorkInterests: undefined,
  }
}

export { aLongQuestionSetCreateInductionDto, aShortQuestionSetCreateInductionDto }
