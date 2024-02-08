import moment from 'moment/moment'
import type {
  SkillsAndInterests,
  WorkAndInterests,
  WorkAndInterestsData,
  WorkExperience,
  WorkInterests,
} from 'viewModels'
import type {
  FutureWorkInterest,
  InductionResponse,
  InPrisonWorkInterest,
  PersonalInterest,
  PersonalSkill,
  PreviousWorkExperience,
} from 'educationAndWorkPlanApiClient'
import toInductionQuestionSet from './inductionQuestionSetMapper'
import enumComparator from './enumComparator'
import { jobComparator } from './jobComparator'

/**
 * Given a [InductionResponse] returns a [WorkAndInterests] instance.
 */
const toWorkAndInterests = (induction: InductionResponse): WorkAndInterests => {
  const inductionQuestionSet = toInductionQuestionSet(induction)
  return {
    problemRetrievingData: false,
    inductionQuestionSet,
    data: toWorkAndInterestsData(induction, inductionQuestionSet),
  }
}

const toWorkAndInterestsData = (
  induction: InductionResponse,
  inductionQuestionSet: 'LONG_QUESTION_SET' | 'SHORT_QUESTION_SET' | undefined,
): WorkAndInterestsData => {
  if (!inductionQuestionSet) {
    return undefined
  }

  return {
    skillsAndInterests: inductionQuestionSet === 'LONG_QUESTION_SET' ? toSkillsAndInterests(induction) : undefined,
    workExperience: inductionQuestionSet === 'LONG_QUESTION_SET' ? toWorkExperience(induction) : undefined,
    workInterests:
      inductionQuestionSet === 'LONG_QUESTION_SET'
        ? toLongQuestionSetWorkInterests(induction)
        : toShortQuestionSetWorkInterests(induction),
  }
}

const toSkillsAndInterests = (induction: InductionResponse): SkillsAndInterests => {
  const personalSkills: Array<PersonalSkill> = induction.personalSkillsAndInterests.skills || []
  const personalInterests: Array<PersonalInterest> = induction.personalSkillsAndInterests.interests || []
  return {
    skills: personalSkills.map(skill => skill.skillType).sort(enumComparator) || [],
    otherSkill: personalSkills.find(skill => skill.skillType === 'OTHER')?.skillTypeOther,
    personalInterests: personalInterests.map(interest => interest.interestType).sort(enumComparator),
    otherPersonalInterest: personalInterests.find(interest => interest.interestType === 'OTHER')?.interestTypeOther,
    updatedBy: induction.personalSkillsAndInterests.updatedBy,
    updatedByDisplayName: induction.personalSkillsAndInterests.updatedByDisplayName,
    updatedAt: moment(induction.personalSkillsAndInterests.updatedAt).toDate(),
  }
}

const toWorkExperience = (induction: InductionResponse): WorkExperience => {
  const previousJobs: Array<PreviousWorkExperience> = induction.previousWorkExperiences.experiences || []
  return {
    hasWorkedPreviously: induction.previousWorkExperiences.hasWorkedBefore,
    jobs: previousJobs
      ?.map(job => {
        return {
          type: job.experienceType,
          other: job.experienceTypeOther,
          role: job.role,
          responsibilities: job.details,
        }
      })
      .sort(jobComparator),
    updatedBy: induction.previousWorkExperiences.updatedBy,
    updatedByDisplayName: induction.previousWorkExperiences.updatedByDisplayName,
    updatedAt: moment(induction.previousWorkExperiences.updatedAt).toDate(),
  }
}

const toLongQuestionSetWorkInterests = (induction: InductionResponse): WorkInterests => {
  const mostRecentlyUpdatedSection: 'MAIN_INDUCTION' | 'WORK_INTERESTS' = moment(induction.updatedAt).isSameOrAfter(
    induction.futureWorkInterests.updatedAt,
  )
    ? 'MAIN_INDUCTION'
    : 'WORK_INTERESTS'

  const workInterests: Array<FutureWorkInterest> = induction.futureWorkInterests.interests || []
  return {
    hopingToWorkOnRelease: induction.workOnRelease.hopingToWork,
    longQuestionSetAnswers: {
      constraintsOnAbilityToWork: induction.workOnRelease.affectAbilityToWork.sort(enumComparator),
      otherConstraintOnAbilityToWork: induction.workOnRelease.affectAbilityToWorkOther,
      jobs: workInterests.map(workInterest => {
        return {
          jobType: workInterest.workType,
          otherJobType: workInterest.workTypeOther,
          specificJobRole: workInterest.role,
        }
      }),
    },
    shortQuestionSetAnswers: undefined,
    updatedBy:
      mostRecentlyUpdatedSection === 'MAIN_INDUCTION' ? induction.updatedBy : induction.futureWorkInterests.updatedBy,
    updatedByDisplayName:
      mostRecentlyUpdatedSection === 'MAIN_INDUCTION'
        ? induction.updatedByDisplayName
        : induction.futureWorkInterests.updatedByDisplayName,
    updatedAt:
      mostRecentlyUpdatedSection === 'MAIN_INDUCTION'
        ? moment(induction.updatedAt).toDate()
        : moment(induction.futureWorkInterests.updatedAt).toDate(),
  }
}

const toShortQuestionSetWorkInterests = (induction: InductionResponse): WorkInterests => {
  const mostRecentlyUpdatedSection: 'MAIN_INDUCTION' | 'WORK_INTERESTS' = moment(induction.updatedAt).isSameOrAfter(
    induction.inPrisonInterests.updatedAt,
  )
    ? 'MAIN_INDUCTION'
    : 'WORK_INTERESTS'

  const workInterests: Array<InPrisonWorkInterest> = induction.inPrisonInterests.inPrisonWorkInterests || []

  return {
    hopingToWorkOnRelease: induction.workOnRelease.hopingToWork,
    longQuestionSetAnswers: undefined,
    shortQuestionSetAnswers: {
      inPrisonWorkInterests: workInterests.map(workInterest => workInterest.workType).sort(enumComparator),
      otherInPrisonerWorkInterest: workInterests.find(workInterest => workInterest.workType === 'OTHER')?.workTypeOther,
      reasonsForNotWantingToWork: induction.workOnRelease.notHopingToWorkReasons.sort(enumComparator),
      otherReasonForNotWantingToWork: induction.workOnRelease.notHopingToWorkOtherReason,
    },
    updatedBy:
      mostRecentlyUpdatedSection === 'MAIN_INDUCTION' ? induction.updatedBy : induction.inPrisonInterests.updatedBy,
    updatedByDisplayName:
      mostRecentlyUpdatedSection === 'MAIN_INDUCTION'
        ? induction.updatedByDisplayName
        : induction.inPrisonInterests.updatedByDisplayName,
    updatedAt:
      mostRecentlyUpdatedSection === 'MAIN_INDUCTION'
        ? moment(induction.updatedAt).toDate()
        : moment(induction.inPrisonInterests.updatedAt).toDate(),
  }
}

export default toWorkAndInterests
