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
    updatedBy: ciagInduction.qualificationsAndTraining.modifiedBy,
    updatedAt: moment(ciagInduction.qualificationsAndTraining.modifiedDateTime).toDate(),
    longQuestionSetAnswers: inductionQuestionSet === 'LONG_QUESTION_SET' ? toLongQuestionSet(ciagInduction) : undefined,
    shortQuestionSetAnswers:
      inductionQuestionSet === 'SHORT_QUESTION_SET' ? toShortQuestionSet(ciagInduction) : undefined,
  }
}

const toLongQuestionSet = (ciagInduction: CiagInduction): EducationAndTrainingLongQuestionSet => {
  return {
    highestEducationLevel: ciagInduction.qualificationsAndTraining.educationLevel,
    additionalTraining: ciagInduction.qualificationsAndTraining.additionalTraining,
    otherAdditionalTraining: ciagInduction.qualificationsAndTraining.additionalTrainingOther,
  }
}

const toShortQuestionSet = (ciagInduction: CiagInduction): EducationAndTrainingShortQuestionSet => {
  const educationalQualifications =
    (ciagInduction.qualificationsAndTraining.qualifications as Array<CiagPrePrisonQualification>) || []
  return {
    additionalTraining: ciagInduction.qualificationsAndTraining.additionalTraining,
    otherAdditionalTraining: ciagInduction.qualificationsAndTraining.additionalTrainingOther,
    educationalQualifications: educationalQualifications.map(qualification => {
      return { ...qualification }
    }),
  }
}

export default toEducationAndTraining
