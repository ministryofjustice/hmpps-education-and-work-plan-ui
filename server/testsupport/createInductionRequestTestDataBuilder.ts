import type { CreateInductionRequest } from 'educationAndWorkPlanApiClient'
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

const aValidCreateInductionRequest = (
  options?: CoreBuilderOptions & {
    hopingToGetWork?: HopingToGetWorkValue
    hasWorkedBefore?: HasWorkedBeforeValue
    hasQualifications?: boolean
  },
): CreateInductionRequest => {
  return {
    ...baseCreateInductionRequestTemplate(options),
    workOnRelease: {
      hopingToWork: options?.hopingToGetWork || HopingToGetWorkValue.YES,
      affectAbilityToWork: [
        AbilityToWorkValue.CARING_RESPONSIBILITIES,
        AbilityToWorkValue.NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH,
        AbilityToWorkValue.OTHER,
      ],
      affectAbilityToWorkOther: 'Variable mental health',
    },
    previousWorkExperiences: {
      hasWorkedBefore: options?.hasWorkedBefore || HasWorkedBeforeValue.YES,
      experiences:
        (options?.hasWorkedBefore || HasWorkedBeforeValue.YES) === HasWorkedBeforeValue.YES
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
      skills: [
        { skillType: SkillsValue.TEAMWORK, skillTypeOther: null },
        { skillType: SkillsValue.WILLINGNESS_TO_LEARN, skillTypeOther: null },
        { skillType: SkillsValue.OTHER, skillTypeOther: 'Tenacity' },
      ],
      interests: [
        { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: null },
        { interestType: PersonalInterestsValue.DIGITAL, interestTypeOther: null },
        { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
      ],
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
      trainingTypes: [
        AdditionalTrainingValue.FIRST_AID_CERTIFICATE,
        AdditionalTrainingValue.MANUAL_HANDLING,
        AdditionalTrainingValue.OTHER,
      ],
      trainingTypeOther: 'Advanced origami',
    },
  }
}

type CoreBuilderOptions = {
  prisonId?: string
}

const baseCreateInductionRequestTemplate = (options?: CoreBuilderOptions): CreateInductionRequest => {
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

export default aValidCreateInductionRequest
