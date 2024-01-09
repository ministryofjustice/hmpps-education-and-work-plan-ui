import moment from 'moment'
import type { AchievedQualification, InductionResponse, InPrisonTrainingInterest } from 'educationAndWorkPlanApiClient'
import type {
  EducationAndTraining,
  EducationAndTrainingData,
  EducationAndTrainingLongQuestionSet,
  EducationAndTrainingShortQuestionSet,
} from 'viewModels'
import toInductionQuestionSet from './inductionQuestionSetMapper'
import educationalQualificationComparator from './educationalQualificationComparator'
import enumComparator from './enumComparator'

/**
 * Given a [InductionResponse] returns a [EducationAndTraining] instance.
 */
const toEducationAndTraining = (induction: InductionResponse): EducationAndTraining => {
  const inductionQuestionSet = toInductionQuestionSet(induction)
  return {
    problemRetrievingData: false,
    inductionQuestionSet,
    data: toEducationAndTrainingData(induction, inductionQuestionSet),
  }
}

const toEducationAndTrainingData = (
  induction: InductionResponse,
  inductionQuestionSet: 'LONG_QUESTION_SET' | 'SHORT_QUESTION_SET' | undefined,
): EducationAndTrainingData => {
  if (!inductionQuestionSet) {
    return undefined
  }

  return {
    longQuestionSetAnswers: inductionQuestionSet === 'LONG_QUESTION_SET' ? toLongQuestionSet(induction) : undefined,
    shortQuestionSetAnswers: inductionQuestionSet === 'SHORT_QUESTION_SET' ? toShortQuestionSet(induction) : undefined,
  }
}

const toLongQuestionSet = (induction: InductionResponse): EducationAndTrainingLongQuestionSet => {
  const mostRecentlyUpdatedSection: 'PREVIOUS_QUALIFICATIONS' | 'PREVIOUS_TRAINING' = moment(
    induction.previousQualifications.updatedAt,
  ).isSameOrAfter(induction.previousTraining.updatedAt)
    ? 'PREVIOUS_QUALIFICATIONS'
    : 'PREVIOUS_TRAINING'

  const educationalQualifications: Array<AchievedQualification> = induction.previousQualifications.qualifications || []

  return {
    updatedBy:
      mostRecentlyUpdatedSection === 'PREVIOUS_QUALIFICATIONS'
        ? induction.previousQualifications.updatedBy
        : induction.previousTraining.updatedBy,
    updatedAt:
      mostRecentlyUpdatedSection === 'PREVIOUS_QUALIFICATIONS'
        ? moment(induction.previousQualifications.updatedAt).toDate()
        : moment(induction.previousTraining.updatedAt).toDate(),
    additionalTraining: induction.previousTraining.trainingTypes.sort(enumComparator),
    otherAdditionalTraining: induction.previousTraining.trainingTypeOther,
    educationalQualifications: educationalQualifications
      .map(qualification => {
        return { ...qualification }
      })
      .sort(educationalQualificationComparator),
    highestEducationLevel: induction.previousQualifications.educationLevel,
  }
}

const toShortQuestionSet = (induction: InductionResponse): EducationAndTrainingShortQuestionSet => {
  const mostRecentlyUpdatedSection: 'PREVIOUS_QUALIFICATIONS' | 'PREVIOUS_TRAINING' = moment(
    induction.previousQualifications.updatedAt,
  ).isSameOrAfter(induction.previousTraining.updatedAt)
    ? 'PREVIOUS_QUALIFICATIONS'
    : 'PREVIOUS_TRAINING'

  const educationalQualifications: Array<AchievedQualification> = induction.previousQualifications.qualifications || []
  const inPrisonTrainingInterests: Array<InPrisonTrainingInterest> =
    induction.inPrisonInterests.inPrisonTrainingInterests || []

  return {
    updatedBy:
      mostRecentlyUpdatedSection === 'PREVIOUS_QUALIFICATIONS'
        ? induction.previousQualifications.updatedBy
        : induction.previousTraining.updatedBy,
    updatedAt:
      mostRecentlyUpdatedSection === 'PREVIOUS_QUALIFICATIONS'
        ? moment(induction.previousQualifications.updatedAt).toDate()
        : moment(induction.previousTraining.updatedAt).toDate(),
    additionalTraining: induction.previousTraining.trainingTypes.sort(enumComparator),
    otherAdditionalTraining: induction.previousTraining.trainingTypeOther,
    educationalQualifications: educationalQualifications
      .map(qualification => {
        return { ...qualification }
      })
      .sort(educationalQualificationComparator),
    inPrisonInterestsEducation: {
      inPrisonInterestsEducation: inPrisonTrainingInterests.map(interest => interest.trainingType).sort(enumComparator),
      inPrisonInterestsEducationOther: inPrisonTrainingInterests.find(interest => interest.trainingType === 'OTHER')
        ?.trainingTypeOther,
      updatedBy: induction.inPrisonInterests.updatedBy,
      updatedAt: moment(induction.inPrisonInterests.updatedAt).toDate(),
    },
  }
}

export default toEducationAndTraining
