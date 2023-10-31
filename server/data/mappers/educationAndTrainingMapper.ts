import moment from 'moment/moment'
import type { CiagInduction, CiagPrePrisonQualification } from 'ciagInductionApiClient'
import type {
  EducationAndTraining,
  EducationAndTrainingData,
  EducationAndTrainingLongQuestionSet,
  EducationAndTrainingShortQuestionSet,
} from 'viewModels'
import toInductionQuestionSet from './inductionQuestionSetMapper'

const toEducationAndTraining = (ciagInduction: CiagInduction): EducationAndTraining => {
  const inductionQuestionSet = toInductionQuestionSet(ciagInduction)
  return {
    problemRetrievingData: false,
    inductionQuestionSet,
    data: toEducationAndTrainingData(ciagInduction, inductionQuestionSet),
  }
}

const toEducationAndTrainingData = (
  ciagInduction: CiagInduction,
  inductionQuestionSet: 'LONG_QUESTION_SET' | 'SHORT_QUESTION_SET' | undefined,
): EducationAndTrainingData => {
  if (!inductionQuestionSet) {
    return undefined
  }

  return {
    longQuestionSetAnswers: inductionQuestionSet === 'LONG_QUESTION_SET' ? toLongQuestionSet(ciagInduction) : undefined,
    shortQuestionSetAnswers:
      inductionQuestionSet === 'SHORT_QUESTION_SET' ? toShortQuestionSet(ciagInduction) : undefined,
  }
}

const toLongQuestionSet = (ciagInduction: CiagInduction): EducationAndTrainingLongQuestionSet => {
  const educationalQualifications =
    (ciagInduction.qualificationsAndTraining.qualifications as Array<CiagPrePrisonQualification>) || []
  return {
    updatedBy: ciagInduction.qualificationsAndTraining.modifiedBy,
    updatedAt: moment(ciagInduction.qualificationsAndTraining.modifiedDateTime).toDate(),
    additionalTraining: ciagInduction.qualificationsAndTraining.additionalTraining,
    otherAdditionalTraining: ciagInduction.qualificationsAndTraining.additionalTrainingOther,
    educationalQualifications: educationalQualifications.map(qualification => {
      return { ...qualification }
    }),
    highestEducationLevel: ciagInduction.qualificationsAndTraining.educationLevel,
  }
}

const toShortQuestionSet = (ciagInduction: CiagInduction): EducationAndTrainingShortQuestionSet => {
  const mostRecentlyUpdatedSection: 'MAIN_INDUCTION' | 'EDUCATION_TRAINING' =
    ciagInduction.modifiedDateTime >= ciagInduction.inPrisonInterests.modifiedDateTime
      ? 'MAIN_INDUCTION'
      : 'EDUCATION_TRAINING'
  const educationalQualifications =
    (ciagInduction.qualificationsAndTraining.qualifications as Array<CiagPrePrisonQualification>) || []
  return {
    updatedBy: ciagInduction.qualificationsAndTraining.modifiedBy,
    updatedAt: moment(ciagInduction.qualificationsAndTraining.modifiedDateTime).toDate(),
    additionalTraining: ciagInduction.qualificationsAndTraining.additionalTraining,
    otherAdditionalTraining: ciagInduction.qualificationsAndTraining.additionalTrainingOther,
    educationalQualifications: educationalQualifications.map(qualification => {
      return { ...qualification }
    }),
    inPrisonInterestsEducation: {
      inPrisonInterestsEducation: ciagInduction.inPrisonInterests.inPrisonEducation,
      inPrisonInterestsEducationOther: ciagInduction.inPrisonInterests.inPrisonEducationOther,
      updatedBy:
        mostRecentlyUpdatedSection === 'MAIN_INDUCTION'
          ? ciagInduction.modifiedBy
          : ciagInduction.inPrisonInterests.modifiedBy,
      updatedAt:
        mostRecentlyUpdatedSection === 'MAIN_INDUCTION'
          ? moment(ciagInduction.modifiedDateTime).toDate()
          : moment(ciagInduction.inPrisonInterests.modifiedDateTime).toDate(),
    },
  }
}

export default toEducationAndTraining
