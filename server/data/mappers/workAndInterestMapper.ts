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
    skills: ciagInduction.skillsAndInterests.skills || [],
    otherSkill: ciagInduction.skillsAndInterests.skillsOther,
    personalInterests: ciagInduction.skillsAndInterests.personalInterests || [],
    otherPersonalInterest: ciagInduction.skillsAndInterests.personalInterestsOther,
    updatedBy: ciagInduction.skillsAndInterests.modifiedBy,
    updatedAt: moment(ciagInduction.skillsAndInterests.modifiedDateTime).toDate(),
  }
}

const toWorkExperience = (ciagInduction: CiagInduction): WorkExperience => {
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

const toLongQuestionSetWorkInterests = (ciagInduction: CiagInduction): WorkInterests => {
  const mostRecentlyUpdatedSection: 'MAIN_INDUCTION' | 'WORK_INTERESTS' =
    ciagInduction.modifiedDateTime >= ciagInduction.workExperience.workInterests.modifiedDateTime
      ? 'MAIN_INDUCTION'
      : 'WORK_INTERESTS'

  const jobInterests: Array<CiagWorkInterestDetail> = ciagInduction.workExperience.workInterests.particularJobInterests
  return {
    hopingToWorkOnRelease: ciagInduction.hopingToGetWork,
    longQuestionSetAnswers: {
      constraintsOnAbilityToWork: ciagInduction.abilityToWork,
      otherConstraintOnAbilityToWork: ciagInduction.abilityToWorkOther,
      jobTypes: jobInterests?.map(jobInterest => jobInterest.workInterest),
      specificJobRoles: jobInterests?.map(jobInterest => jobInterest.role),
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
      inPrisonWorkInterests: ciagInduction.inPrisonInterests.inPrisonWork,
      otherInPrisonerWorkInterest: ciagInduction.inPrisonInterests.inPrisonWorkOther,
      reasonsForNotWantingToWork: ciagInduction.reasonToNotGetWork,
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

export default toWorkAndInterests
