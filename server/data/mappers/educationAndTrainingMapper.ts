import moment from 'moment/moment'
import type { CiagInduction, CiagPrePrisonQualification } from 'ciagInductionApiClient'
import type {
  EducationAndTraining,
  EducationAndTrainingData,
  EducationAndTrainingLongQuestionSet,
  EducationAndTrainingShortQuestionSet,
} from 'viewModels'
import toInductionQuestionSet from './inductionQuestionSetMapper'
import educationalQualificationComparator from './educationalQualificationComparator'
import enumComparator from './enumComparator'

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
    additionalTraining: ciagInduction.qualificationsAndTraining.additionalTraining.sort(enumComparator),
    otherAdditionalTraining: ciagInduction.qualificationsAndTraining.additionalTrainingOther,
    educationalQualifications: educationalQualifications
      .map(qualification => {
        return { ...qualification }
      })
      .sort(educationalQualificationComparator),
    highestEducationLevel: ciagInduction.qualificationsAndTraining.educationLevel,
  }
}

const toShortQuestionSet = (ciagInduction: CiagInduction): EducationAndTrainingShortQuestionSet => {
  const educationalQualifications =
    (ciagInduction.qualificationsAndTraining.qualifications as Array<CiagPrePrisonQualification>) || []
  return {
    updatedBy: ciagInduction.qualificationsAndTraining.modifiedBy,
    updatedAt: moment(ciagInduction.qualificationsAndTraining.modifiedDateTime).toDate(),
    additionalTraining: ciagInduction.qualificationsAndTraining.additionalTraining.sort(enumComparator),
    otherAdditionalTraining: ciagInduction.qualificationsAndTraining.additionalTrainingOther,
    educationalQualifications: educationalQualifications
      .map(qualification => {
        return { ...qualification }
      })
      .sort(educationalQualificationComparator),
    inPrisonInterestsEducation: {
      inPrisonInterestsEducation: ciagInduction.inPrisonInterests.inPrisonEducation.sort(enumComparator),
      inPrisonInterestsEducationOther: ciagInduction.inPrisonInterests.inPrisonEducationOther,
      updatedBy: ciagInduction.inPrisonInterests.modifiedBy,
      updatedAt: moment(ciagInduction.inPrisonInterests.modifiedDateTime).toDate(),
    },
  }
}

export default toEducationAndTraining
