import type { InPrisonCourseRecords } from 'viewModels'
import {
  aValidEnglishInPrisonCourse,
  aValidEnglishInPrisonCourseCompletedWithinLast12Months,
  aValidMathsInPrisonCourse,
} from './inPrisonCourseTestDataBuilder'

const validInPrisonCourseRecords = (prisonNumber = 'A1234BC') =>
  ({
    problemRetrievingData: false,
    prisonNumber,
    totalRecords: 3,
    coursesByStatus: {
      COMPLETED: [aValidMathsInPrisonCourse(), aValidEnglishInPrisonCourseCompletedWithinLast12Months()],
      IN_PROGRESS: [aValidEnglishInPrisonCourse()],
      WITHDRAWN: [],
      TEMPORARILY_WITHDRAWN: [],
    },
    coursesCompletedInLast12Months: [aValidEnglishInPrisonCourseCompletedWithinLast12Months()],
  }) as InPrisonCourseRecords

export default validInPrisonCourseRecords
