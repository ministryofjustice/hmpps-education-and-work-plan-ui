import type { InPrisonCourse, InPrisonCourseRecords } from 'viewModels'
import {
  aValidEnglishInPrisonCourse,
  aValidEnglishInPrisonCourseCompletedWithinLast12Months,
  aValidMathsInPrisonCourse,
} from './inPrisonCourseTestDataBuilder'

const validInPrisonCourseRecords = (options?: {
  totalRecords?: number
  completedCourses?: Array<InPrisonCourse>
  inProgressCourses?: Array<InPrisonCourse>
  withdrawnCourses?: Array<InPrisonCourse>
  temporarilyWithdrawnCourses?: Array<InPrisonCourse>
  coursesCompletedInLast12Months?: Array<InPrisonCourse>
}): InPrisonCourseRecords => ({
  totalRecords: options?.totalRecords || 3,
  coursesByStatus: {
    COMPLETED: options?.completedCourses || [
      aValidMathsInPrisonCourse(),
      aValidEnglishInPrisonCourseCompletedWithinLast12Months(),
    ],
    IN_PROGRESS: options?.inProgressCourses || [aValidEnglishInPrisonCourse()],
    WITHDRAWN: options?.withdrawnCourses || [],
    TEMPORARILY_WITHDRAWN: options?.temporarilyWithdrawnCourses || [],
  },
  coursesCompletedInLast12Months: options?.coursesCompletedInLast12Months || [
    aValidEnglishInPrisonCourseCompletedWithinLast12Months(),
  ],
  hasWithdrawnOrInProgressCourses: jest.fn(),
  hasCoursesCompletedMoreThan12MonthsAgo: jest.fn(),
})

export default validInPrisonCourseRecords
