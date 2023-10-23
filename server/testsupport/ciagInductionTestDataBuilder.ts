import type { CiagInduction } from 'ciagInductionApiClient'

const aLongQuestionSetCiagInduction = (options?: {
  prisonNumber?: string
  hasWorkedBefore?: boolean
  hasSkills?: boolean
  hasInterests?: boolean
  hasFutureJobInterests?: boolean
}): CiagInduction => {
  return {
    ...baseCiagInductionTemplate(options?.prisonNumber || 'A1234BC'),
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
        modifiedBy: 'ANOTHER_DPS_USER_GEN',
        modifiedDateTime: '2023-08-22T11:12:31.943Z',
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
  }
}

const aShortQuestionSetCiagInduction = (options?: {
  prisonNumber?: string
  hopingToGetWork?: 'NO' | 'NOT_SURE'
}): CiagInduction => {
  return {
    ...baseCiagInductionTemplate(options?.prisonNumber || 'A1234BC'),
    hopingToGetWork: options?.hopingToGetWork || 'NO',
    reasonToNotGetWork: ['HEALTH', 'OTHER'],
    reasonToNotGetWorkOther: 'Will be of retirement age at release',
    inPrisonInterests: {
      modifiedBy: 'ANOTHER_DPS_USER_GEN',
      modifiedDateTime: '2023-08-22T11:12:31.943Z',
      inPrisonWork: ['CLEANING_AND_HYGIENE', 'OTHER'],
      inPrisonWorkOther: 'Gardening and grounds keeping',
    },
  }
}

const aCiagInductionWithOtherQualifications = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    ...baseCiagInductionTemplate(prisonNumber),
    qualificationsAndTraining: {
      modifiedBy: 'ANOTHER_DPS_USER_GEN',
      modifiedDateTime: '2023-08-22T11:12:31.943Z',
      id: 1234,
      educationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
      qualifications: [],
      additionalTraining: ['FIRST_AID_CERTIFICATE', 'MANUAL_HANDLING'],
      additionalTrainingOther: null,
      inPrisonInterests: null,
      schemaVersion: null,
    },
  }
}

const aCiagInductionWithNoOtherQualifications = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    ...baseCiagInductionTemplate(prisonNumber),
    qualificationsAndTraining: null,
  }
}

const baseCiagInductionTemplate = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    hopingToGetWork: 'YES',
    offenderId: prisonNumber,
    createdBy: 'DPS_USER_GEN',
    createdDateTime: '2023-08-15T14:47:09.123Z',
    modifiedBy: 'ANOTHER_DPS_USER_GEN',
    modifiedDateTime: '2023-08-22T11:12:31.943Z',
  }
}

export {
  aLongQuestionSetCiagInduction,
  aShortQuestionSetCiagInduction,
  aCiagInductionWithOtherQualifications,
  aCiagInductionWithNoOtherQualifications,
}
