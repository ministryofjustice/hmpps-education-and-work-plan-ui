import type { CiagInduction } from 'ciagInductionApiClient'

const aCiagInductionWithNoRecordOfAnyPreviousWorkExperience = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    ...baseCiagInductionUsedForBuildingOtherInstances(prisonNumber),
    workExperience: null,
  }
}

const aCiagInductionWithNoPreviousWorkExperience = (prisonNumber = 'A1234BC'): CiagInduction => {
  return {
    ...baseCiagInductionUsedForBuildingOtherInstances(prisonNumber),
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
    ...baseCiagInductionUsedForBuildingOtherInstances(prisonNumber),
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

const baseCiagInductionUsedForBuildingOtherInstances = (prisonNumber = 'A1234BC'): CiagInduction => {
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
}
