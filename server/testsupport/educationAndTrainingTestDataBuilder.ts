import moment from 'moment'
import type { EducationAndTraining } from 'viewModels'

export default function aValidShortQuestionSetEducationAndTraining(): EducationAndTraining {
  return {
    problemRetrievingData: false,
    inductionQuestionSet: 'SHORT_QUESTION_SET',
    data: {
      updatedAt: moment('2023-08-22T13:02:31.943Z').toDate(),
      updatedBy: 'ANOTHER_DPS_USER_GEN',
      longQuestionSetAnswers: undefined,
      shortQuestionSetAnswers: {
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
    },
  }
}