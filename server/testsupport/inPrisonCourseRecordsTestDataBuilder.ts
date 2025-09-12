import type { InPrisonCourseRecords } from 'viewModels'
import {
  aValidEnglishInPrisonCourse,
  aValidEnglishInPrisonCourseCompletedWithinLast12Months,
  aValidMathsInPrisonCourse,
} from './inPrisonCourseTestDataBuilder'

const validInPrisonCourseRecords = (): InPrisonCourseRecords => ({
  problemRetrievingData: false,
  totalRecords: 3,
  coursesByStatus: {
    COMPLETED: [aValidMathsInPrisonCourse(), aValidEnglishInPrisonCourseCompletedWithinLast12Months()],
    IN_PROGRESS: [aValidEnglishInPrisonCourse()],
    WITHDRAWN: [],
    TEMPORARILY_WITHDRAWN: [],
  },
  coursesCompletedInLast12Months: [aValidEnglishInPrisonCourseCompletedWithinLast12Months()],
  hasWithdrawnOrInProgressCourses: jest.fn(),
  hasCoursesCompletedMoreThan12MonthsAgo: jest.fn(),
})

export default validInPrisonCourseRecords
