import type { CiagInduction } from 'ciagInductionApiClient'

const aCiagInductionWithNoRecordOfAnyPreviousWorkExperience = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    ...baseCiagInductionTemplate(prisonNumber),
    workExperience: null,
  }
}

const aCiagInductionWithNoPreviousWorkExperience = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    ...baseCiagInductionTemplate(prisonNumber),
    workExperience: {
      hasWorkedBefore: false,
      modifiedBy: 'ANOTHER_DPS_USER_GEN',
      modifiedDateTime: '2023-08-22T11:12:31.943Z',
      workExperience: null,
    },
  }
}

const aCiagInductionWithPreviousWorkExperience = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    ...baseCiagInductionTemplate(prisonNumber),
    workExperience: {
      hasWorkedBefore: true,
      modifiedBy: 'ANOTHER_DPS_USER_GEN',
      modifiedDateTime: '2023-08-22T11:12:31.943Z',
      workExperience: [
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
      ],
    },
  }
}

const aCiagInductionWithNoRecordOfAnyWorkInterests = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    ...baseCiagInductionTemplate(prisonNumber),
    workExperience: {
      workInterests: null,
    },
  }
}

const aCiagInductionWithJobInterests = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    ...baseCiagInductionTemplate(prisonNumber),
    hopingToGetWork: 'YES',
    abilityToWork: ['LIMITED_BY_OFFENSE'],
    abilityToWorkOther: undefined,
    workExperience: {
      workInterests: {
        modifiedBy: 'ANOTHER_DPS_USER_GEN',
        modifiedDateTime: '2023-08-22T11:12:31.943Z',
        particularJobInterests: [
          {
            workInterest: 'CONSTRUCTION',
            role: 'General labourer',
          },
          {
            workInterest: 'OTHER',
            role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
          },
        ],
      },
    },
  }
}

const aCiagInductionWithNoJobInterests = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    ...baseCiagInductionTemplate(prisonNumber),
    hopingToGetWork: 'NOT_SURE',
    abilityToWork: ['CARING_RESPONSIBILITIES', 'OTHER'],
    abilityToWorkOther: 'Generally a bit lazy',
    workExperience: {
      workInterests: {
        modifiedBy: 'ANOTHER_DPS_USER_GEN',
        modifiedDateTime: '2023-08-22T11:12:31.943Z',
        particularJobInterests: null,
      },
    },
  }
}

const aCiagInductionWithPrePrisonQualifications = (prisonNumber = 'A1234BC'): CiagInduction => {
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

const aCiagInductionWithNoPrePrisonQualifications = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    ...baseCiagInductionTemplate(prisonNumber),
    qualificationsAndTraining: null,
  }
}

const baseCiagInductionTemplate = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    offenderId: prisonNumber,
    createdBy: 'DPS_USER_GEN',
    createdDateTime: '2023-08-15T14:47:09.123Z',
    modifiedBy: 'ANOTHER_DPS_USER_GEN',
    modifiedDateTime: '2023-08-22T11:12:31.943Z',
  }
}

export {
  aCiagInductionWithNoRecordOfAnyPreviousWorkExperience,
  aCiagInductionWithNoPreviousWorkExperience,
  aCiagInductionWithPreviousWorkExperience,
  aCiagInductionWithNoRecordOfAnyWorkInterests,
  aCiagInductionWithNoJobInterests,
  aCiagInductionWithJobInterests,
  aCiagInductionWithPrePrisonQualifications,
  aCiagInductionWithNoPrePrisonQualifications,
}
