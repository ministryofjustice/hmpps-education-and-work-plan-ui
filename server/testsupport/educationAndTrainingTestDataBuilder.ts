import moment from 'moment'
import type { EducationAndTraining } from 'viewModels'

const aValidShortQuestionSetEducationAndTraining = (): EducationAndTraining => {
  return {
    problemRetrievingData: false,
    inductionQuestionSet: 'SHORT_QUESTION_SET',
    data: {
      longQuestionSetAnswers: undefined,
      shortQuestionSetAnswers: {
        updatedAt: moment('2023-08-22T13:02:31.943Z').toDate(),
        updatedBy: 'ANOTHER_DPS_USER_GEN',
        additionalTraining: ['FULL_UK_DRIVING_LICENCE', 'OTHER'],
        otherAdditionalTraining: 'Beginners cookery for IT professionals',
        educationalQualifications: [
          {
            subject: 'English',
            grade: 'C',
            level: 'LEVEL_6',
          },
        ],
        inPrisonInterestsEducation: ['FORKLIFT_DRIVING', 'CATERING', 'OTHER'],
        inPrisonInterestsEducationOther: 'Advanced origami',
      },
    },
  }
}

const aValidLongQuestionSetEducationAndTraining = (): EducationAndTraining => {
  return {
    problemRetrievingData: false,
    inductionQuestionSet: 'LONG_QUESTION_SET',
    data: {
      longQuestionSetAnswers: {
        updatedAt: moment('2023-08-22T13:02:31.943Z').toDate(),
        updatedBy: 'ANOTHER_DPS_USER_GEN',
        highestEducationLevel: 'FURTHER_EDUCATION_COLLEGE',
        additionalTraining: ['FULL_UK_DRIVING_LICENCE', 'OTHER'],
        otherAdditionalTraining: 'Beginners cookery for IT professionals',
        educationalQualifications: [
          {
            subject: 'English',
            grade: 'C',
            level: 'LEVEL_6',
          },
        ],
      },
      shortQuestionSetAnswers: undefined,
    },
  }
}

export { aValidShortQuestionSetEducationAndTraining, aValidLongQuestionSetEducationAndTraining }
