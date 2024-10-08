import type { CreateOrUpdateInductionDto } from 'inductionDto'
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

const aValidUpdateInductionDto = (
  options?: CoreBuilderOptions & {
    hopingToGetWork?: HopingToGetWorkValue
    hasWorkedBefore?: HasWorkedBeforeValue
    hasQualifications?: boolean
  },
): CreateOrUpdateInductionDto => {
  return {
    ...baseUpdateInductionDtoTemplate(options),
    workOnRelease: {
      reference: 'bdebe39f-6f85-459b-81be-a26341c3fe3c',
      hopingToWork: options?.hopingToGetWork || HopingToGetWorkValue.YES,
      affectAbilityToWork: [
        AbilityToWorkValue.CARING_RESPONSIBILITIES,
        AbilityToWorkValue.NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH,
        AbilityToWorkValue.OTHER,
      ],
      affectAbilityToWorkOther: 'Variable mental health',
    },
    inPrisonInterests: {
      reference: 'ae6a6a94-df32-4a90-b39d-ff1a100a6da0',
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
      reference: 'bb45462e-8225-490d-8c1c-ad6692223d4d',
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
      reference: 'cad34670-691d-4862-8014-dc08a6f620b9',
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
    previousQualifications: {
      reference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
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
      reference: 'a8e1fe50-1e3b-4784-a27f-ee1c54fc7616',
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

const baseUpdateInductionDtoTemplate = (options?: CoreBuilderOptions): CreateOrUpdateInductionDto => {
  return {
    reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
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

export default aValidUpdateInductionDto
