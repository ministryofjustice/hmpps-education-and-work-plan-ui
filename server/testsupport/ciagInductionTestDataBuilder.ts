import type { CiagInduction } from 'ciagInductionApiClient'

const aLongQuestionSetCiagInduction = (options?: {
  prisonNumber?: string
  hasWorkedBefore?: boolean
  hasSkills?: boolean
  hasInterests?: boolean
  hasFutureJobInterests?: boolean
  modifiedBy?: string
  modifiedByDateTime?: string
  workInterestModifiedBy?: string
  workInterestModifiedByDateTime?: string
}): CiagInduction => {
  return {
    ...baseCiagInductionTemplate({
      prisonNumber: options?.prisonNumber,
      modifiedBy: options?.modifiedBy,
      modifiedDateTime: options?.modifiedByDateTime,
    }),
    hopingToGetWork: 'YES',
    workExperience: {
      modifiedBy: 'ANOTHER_DPS_USER_GEN',
      modifiedDateTime: '2023-08-22T11:12:31.943Z',
      hasWorkedBefore:
        !options || options.hasWorkedBefore === null || options.hasWorkedBefore === undefined
          ? true
          : options.hasWorkedBefore,
      workExperience:
        !options ||
        options.hasWorkedBefore === null ||
        options.hasWorkedBefore === undefined ||
        options.hasWorkedBefore === true
          ? [
              {
                typeOfWorkExperience: 'CONSTRUCTION',
                role: 'General labourer',
                details: 'Groundwork and basic block work and bricklaying',
              },
              {
                typeOfWorkExperience: 'OTHER',
                otherWork: 'Retail delivery',
                role: 'Milkman',
                details: 'Self employed franchise operator delivering milk and associated diary products.',
              },
            ]
          : [],
      workInterests: {
        modifiedBy: options?.workInterestModifiedBy || 'ANOTHER_DPS_USER_GEN',
        modifiedDateTime: options?.workInterestModifiedByDateTime || '2023-08-22T11:12:31.943Z',
        particularJobInterests:
          !options ||
          options.hasFutureJobInterests === null ||
          options.hasFutureJobInterests === undefined ||
          options.hasFutureJobInterests === true
            ? [
                {
                  workInterest: 'CONSTRUCTION',
                  role: 'General labourer',
                },
                {
                  workInterest: 'OTHER',
                  role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
                },
              ]
            : [],
      },
    },
    skillsAndInterests: {
      modifiedBy: 'ANOTHER_DPS_USER_GEN',
      modifiedDateTime: '2023-08-22T11:12:31.943Z',
      skills:
        !options || options.hasSkills === null || options.hasSkills === undefined || options.hasSkills === true
          ? ['TEAMWORK', 'WILLINGNESS_TO_LEARN', 'OTHER']
          : [],
      skillsOther:
        !options || options.hasSkills === null || options.hasSkills === undefined || options.hasSkills === true
          ? 'Tenacity'
          : undefined,
      personalInterests:
        !options || options.hasInterests === null || options.hasInterests === undefined || options.hasInterests === true
          ? ['CREATIVE', 'DIGITAL', 'OTHER']
          : [],
      personalInterestsOther:
        !options || options.hasInterests === null || options.hasInterests === undefined || options.hasInterests === true
          ? 'Renewable energy'
          : undefined,
    },
    qualificationsAndTraining: {
      modifiedBy: 'ANOTHER_DPS_USER_GEN',
      modifiedDateTime: '2023-08-22T13:02:31.943Z',
      id: 1234,
      educationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
      qualifications: [
        {
          subject: 'Pottery',
          grade: 'C',
          level: 'LEVEL_4',
        },
      ],
      additionalTraining: ['FIRST_AID_CERTIFICATE', 'MANUAL_HANDLING', 'OTHER'],
      additionalTrainingOther: 'Advanced origami',
      inPrisonInterests: null,
      schemaVersion: null,
    },
  }
}

const aShortQuestionSetCiagInduction = (options?: {
  prisonNumber?: string
  hopingToGetWork?: 'NO' | 'NOT_SURE'
}): CiagInduction => {
  return {
    ...baseCiagInductionTemplate({ prisonNumber: options?.prisonNumber }),
    hopingToGetWork: options?.hopingToGetWork || 'NO',
    reasonToNotGetWork: ['HEALTH', 'OTHER'],
    reasonToNotGetWorkOther: 'Will be of retirement age at release',
    inPrisonInterests: {
      modifiedBy: 'ANOTHER_DPS_USER_GEN',
      modifiedDateTime: '2023-08-22T11:12:31.943Z',
      inPrisonWork: ['CLEANING_AND_HYGIENE', 'OTHER'],
      inPrisonWorkOther: 'Gardening and grounds keeping',
      inPrisonEducation: ['FORKLIFT_DRIVING', 'CATERING', 'OTHER'],
      inPrisonEducationOther: 'Advanced origami',
    },
    qualificationsAndTraining: {
      modifiedBy: 'ANOTHER_DPS_USER_GEN',
      modifiedDateTime: '2023-08-22T13:02:31.943Z',
      id: 1234,
      educationLevel: null,
      qualifications: [
        {
          subject: 'English',
          grade: 'C',
          level: 'LEVEL_6',
        },
        {
          subject: 'Maths',
          grade: 'A*',
          level: 'LEVEL_6',
        },
      ],
      additionalTraining: ['FULL_UK_DRIVING_LICENCE', 'OTHER'],
      additionalTrainingOther: 'Beginners cookery for IT professionals',
      schemaVersion: null,
    },
  }
}

const baseCiagInductionTemplate = (options?: {
  prisonNumber?: string
  createBy?: string
  createdDateTime?: string
  modifiedBy?: string
  modifiedDateTime?: string
}): CiagInduction => {
  return {
    offenderId: options?.prisonNumber || 'A1234BC',
    createdBy: options?.createBy || 'DPS_USER_GEN',
    createdDateTime: options?.createdDateTime || '2023-08-15T14:47:09.123Z',
    modifiedBy: options?.modifiedBy || 'ANOTHER_DPS_USER_GEN',
    modifiedDateTime: options?.modifiedDateTime || '2023-08-22T11:12:31.943Z',
  }
}

export { aLongQuestionSetCiagInduction, aShortQuestionSetCiagInduction }
