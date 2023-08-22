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
  aCiagInductionWithPrePrisonQualifications,
  aCiagInductionWithNoPrePrisonQualifications,
}
