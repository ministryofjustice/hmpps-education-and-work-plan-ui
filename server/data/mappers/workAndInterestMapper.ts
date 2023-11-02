import moment from 'moment'
import type { CiagInduction, CiagWorkExperience, CiagWorkInterestDetail } from 'ciagInductionApiClient'
import type {
  SkillsAndInterests,
  WorkAndInterests,
  WorkAndInterestsData,
  WorkExperience,
  WorkInterests,
} from 'viewModels'
import toInductionQuestionSet from './inductionQuestionSetMapper'
import { jobComparator, workInterestJobComparator } from './jobComparator'
import enumComparator from './enumComparator'

const toWorkAndInterests = (ciagInduction: CiagInduction): WorkAndInterests => {
  const inductionQuestionSet = toInductionQuestionSet(ciagInduction)
  return {
    problemRetrievingData: false,
    inductionQuestionSet,
    data: toWorkAndInterestsData(ciagInduction, inductionQuestionSet),
  }
}

const toWorkAndInterestsData = (
  ciagInduction: CiagInduction,
  inductionQuestionSet: 'LONG_QUESTION_SET' | 'SHORT_QUESTION_SET' | undefined,
): WorkAndInterestsData => {
  if (!inductionQuestionSet) {
    return undefined
  }

  return {
    skillsAndInterests: inductionQuestionSet === 'LONG_QUESTION_SET' ? toSkillsAndInterests(ciagInduction) : undefined,
    workExperience: inductionQuestionSet === 'LONG_QUESTION_SET' ? toWorkExperience(ciagInduction) : undefined,
    workInterests:
      inductionQuestionSet === 'LONG_QUESTION_SET'
        ? toLongQuestionSetWorkInterests(ciagInduction)
        : toShortQuestionSetWorkInterests(ciagInduction),
  }
}

const toSkillsAndInterests = (ciagInduction: CiagInduction): SkillsAndInterests => {
  return {
    skills: ciagInduction.skillsAndInterests.skills.sort(enumComparator) || [],
    otherSkill: ciagInduction.skillsAndInterests.skillsOther,
    personalInterests: ciagInduction.skillsAndInterests.personalInterests.sort(enumComparator) || [],
    otherPersonalInterest: ciagInduction.skillsAndInterests.personalInterestsOther,
    updatedBy: ciagInduction.skillsAndInterests.modifiedBy,
    updatedAt: moment(ciagInduction.skillsAndInterests.modifiedDateTime).toDate(),
  }
}

const toWorkExperience = (ciagInduction: CiagInduction): WorkExperience => {
  const previousJobs: Array<CiagWorkExperience> = ciagInduction.workExperience.workExperience
  return {
    hasWorkedPreviously: ciagInduction.workExperience.hasWorkedBefore,
    jobs: previousJobs
      ?.map(job => {
        return {
          type: job.typeOfWorkExperience,
          other: job.otherWork,
          role: job.role,
          responsibilities: job.details,
        }
      })
      .sort(jobComparator),
    updatedBy: ciagInduction.workExperience.modifiedBy,
    updatedAt: moment(ciagInduction.workExperience.modifiedDateTime).toDate(),
  }
}

const toLongQuestionSetWorkInterests = (ciagInduction: CiagInduction): WorkInterests => {
  const mostRecentlyUpdatedSection: 'MAIN_INDUCTION' | 'WORK_INTERESTS' =
    ciagInduction.modifiedDateTime >= ciagInduction.workExperience.workInterests.modifiedDateTime
      ? 'MAIN_INDUCTION'
      : 'WORK_INTERESTS'

  return {
    hopingToWorkOnRelease: ciagInduction.hopingToGetWork,
    longQuestionSetAnswers: {
      constraintsOnAbilityToWork: ciagInduction.abilityToWork.sort(enumComparator),
      otherConstraintOnAbilityToWork: ciagInduction.abilityToWorkOther,
      jobs: getJobInterestsWithSpecificJobRoles(ciagInduction).sort(workInterestJobComparator),
    },
    shortQuestionSetAnswers: undefined,
    updatedBy:
      mostRecentlyUpdatedSection === 'MAIN_INDUCTION'
        ? ciagInduction.modifiedBy
        : ciagInduction.workExperience.workInterests.modifiedBy,
    updatedAt:
      mostRecentlyUpdatedSection === 'MAIN_INDUCTION'
        ? moment(ciagInduction.modifiedDateTime).toDate()
        : moment(ciagInduction.workExperience.workInterests.modifiedDateTime).toDate(),
  }
}

const toShortQuestionSetWorkInterests = (ciagInduction: CiagInduction): WorkInterests => {
  const mostRecentlyUpdatedSection: 'MAIN_INDUCTION' | 'WORK_INTERESTS' =
    ciagInduction.modifiedDateTime >= ciagInduction.inPrisonInterests.modifiedDateTime
      ? 'MAIN_INDUCTION'
      : 'WORK_INTERESTS'

  return {
    hopingToWorkOnRelease: ciagInduction.hopingToGetWork,
    longQuestionSetAnswers: undefined,
    shortQuestionSetAnswers: {
      inPrisonWorkInterests: ciagInduction.inPrisonInterests.inPrisonWork.sort(enumComparator),
      otherInPrisonerWorkInterest: ciagInduction.inPrisonInterests.inPrisonWorkOther,
      reasonsForNotWantingToWork: ciagInduction.reasonToNotGetWork.sort(enumComparator),
      otherReasonForNotWantingToWork: ciagInduction.reasonToNotGetWorkOther,
    },
    updatedBy:
      mostRecentlyUpdatedSection === 'MAIN_INDUCTION'
        ? ciagInduction.modifiedBy
        : ciagInduction.inPrisonInterests.modifiedBy,
    updatedAt:
      mostRecentlyUpdatedSection === 'MAIN_INDUCTION'
        ? moment(ciagInduction.modifiedDateTime).toDate()
        : moment(ciagInduction.inPrisonInterests.modifiedDateTime).toDate(),
  }
}

/**
 * Returns an array of the prisoner's job type interests and specific job role.
 * This mapped from two arrays in the CIAG Induction, where the first is the list of job types that they are interested in,
 * and the second is the list of job types that have a specific job role of interest.
 * It's basically the combining and flattening of two arrays.
 *
 * @returns Array<
 *  {
 *    jobType: 'OUTDOOR' | 'CONSTRUCTION' | 'DRIVING' | 'BEAUTY' | 'HOSPITALITY' | 'TECHNICAL' | 'MANUFACTURING' | 'OFFICE' | 'RETAIL' | 'SPORTS' | 'WAREHOUSING' | 'WASTE_MANAGEMENT' | 'EDUCATION_TRAINING' | 'CLEANING_AND_MAINTENANCE' | 'OTHER'
 *    specificJobRole?: string
 *  }
 * >
 */
const getJobInterestsWithSpecificJobRoles = (ciagInduction: CiagInduction) => {
  return (
    ciagInduction.workExperience.workInterests.workInterests as Array<
      | 'OUTDOOR'
      | 'CONSTRUCTION'
      | 'DRIVING'
      | 'BEAUTY'
      | 'HOSPITALITY'
      | 'TECHNICAL'
      | 'MANUFACTURING'
      | 'OFFICE'
      | 'RETAIL'
      | 'SPORTS'
      | 'WAREHOUSING'
      | 'WASTE_MANAGEMENT'
      | 'EDUCATION_TRAINING'
      | 'CLEANING_AND_MAINTENANCE'
      | 'OTHER'
    >
  ).map(jobType => {
    return {
      jobType,
      otherJobType: jobType === 'OTHER' ? ciagInduction.workExperience.workInterests.workInterestsOther : undefined,
      specificJobRole: (
        ciagInduction.workExperience.workInterests.particularJobInterests as Array<CiagWorkInterestDetail>
      ).find(jobInterest => jobInterest.workInterest === jobType)?.role,
    }
  })
}

export default toWorkAndInterests
