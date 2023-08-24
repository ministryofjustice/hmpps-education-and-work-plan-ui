import moment from 'moment'
import type { CiagInduction, CiagWorkExperience, CiagWorkInterestDetail } from 'ciagInductionApiClient'
import type {
  SkillsAndInterests,
  WorkAndInterests,
  WorkAndInterestsData,
  WorkExperience,
  WorkInterests,
} from 'viewModels'

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

  return {
    skillsAndInterests: toSkillsAndInterests(ciagInduction),
    workExperience: toWorkExperience(ciagInduction),
    workInterests: toWorkInterests(ciagInduction),
  }
}

const toSkillsAndInterests = (ciagInduction: CiagInduction): SkillsAndInterests => {
  if (!ciagInduction.skillsAndInterests) {
    return undefined
  }

  return {
    skills: ciagInduction.skillsAndInterests.skills || [],
    otherSkill: ciagInduction.skillsAndInterests.skillOTHER,
    personalInterests: ciagInduction.skillsAndInterests.personalInterests || [],
    otherPersonalInterest: ciagInduction.skillsAndInterests.personalInterestsOther,
    updatedBy: ciagInduction.skillsAndInterests.modifiedBy,
    updatedAt: moment(ciagInduction.skillsAndInterests.modifiedDateTime).toDate(),
  }
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

const toWorkInterests = (ciagInduction: CiagInduction): WorkInterests => {
  if (!ciagInduction.workExperience || !ciagInduction.workExperience.workInterests) {
    return undefined
  }

  const jobInterests: Array<CiagWorkInterestDetail> = ciagInduction.workExperience.workInterests.particularJobInterests
  return {
    hopingToWorkOnRelease: ciagInduction.hopingToGetWork,
    constraintsOnAbilityToWork: ciagInduction.abilityToWork,
    otherConstraintOnAbilityToWork: ciagInduction.abilityToWorkOther,
    jobTypes: jobInterests?.map(jobInterest => jobInterest.workInterest),
    specificJobRoles: jobInterests?.map(jobInterest => jobInterest.role),
    updatedBy: ciagInduction.workExperience.workInterests.modifiedBy,
    updatedAt: moment(ciagInduction.workExperience.workInterests.modifiedDateTime).toDate(),
  }
}

export default toWorkAndInterests
