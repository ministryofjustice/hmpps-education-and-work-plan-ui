import moment from 'moment'
import type { CiagInduction, CiagWorkExperience } from 'ciagInductionApiClient'
import type { WorkAndInterests, WorkAndInterestsData, WorkExperience } from 'viewModels'

const toWorkAndInterests = (ciagInduction: CiagInduction): WorkAndInterests => {
  return {
    problemRetrievingData: false,
    data: toWorkAndInterestsData(ciagInduction),
  }
}

const toWorkAndInterestsData = (ciagInduction: CiagInduction): WorkAndInterestsData => {
  if (!ciagInduction) {
    return undefined
  }

  // TODO RR-115 - map the fields
  return { skillsAndInterests: undefined, workExperience: toWorkExperience(ciagInduction), workInterests: undefined }
}

const toWorkExperience = (ciagInduction: CiagInduction): WorkExperience => {
  if (!ciagInduction.workExperience) {
    return undefined
  }

  const previousJobs: Array<CiagWorkExperience> = ciagInduction.workExperience.workExperience
  return {
    hasWorkedPreviously: ciagInduction.workExperience.hasWorkedBefore,
    jobs: previousJobs?.map(job => {
      return {
        type: job.typeOfWorkExperience,
        other: job.otherWork,
        role: job.role,
        responsibilities: job.details,
      }
    }),
    updatedBy: ciagInduction.workExperience.modifiedBy,
    updatedAt: moment(ciagInduction.workExperience.modifiedDateTime).toDate(),
  }
}

export default toWorkAndInterests
