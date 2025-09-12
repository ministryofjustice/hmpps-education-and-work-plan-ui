import { startOfToday, sub } from 'date-fns'
import type { InPrisonCourseRecords } from 'viewModels'
import type { LearnerEducation } from 'curiousApiClient'
import { toInPrisonCourse } from './inPrisonCourseMapper'

const toInPrisonCourseRecords = (apiLearnerEducations: Array<LearnerEducation>): InPrisonCourseRecords => {
  const allCourses = apiLearnerEducations.map(learnerEducation => toInPrisonCourse(learnerEducation))

  const completedCourses = [...allCourses].filter(inPrisonCourse => inPrisonCourse.courseStatus === 'COMPLETED')
  const inProgressCourses = [...allCourses].filter(inPrisonCourse => inPrisonCourse.courseStatus === 'IN_PROGRESS')
  const withdrawnCourses = [...allCourses].filter(inPrisonCourse => inPrisonCourse.courseStatus === 'WITHDRAWN')
  const temporarilyWithdrawnCourses = [...allCourses].filter(
    inPrisonCourse => inPrisonCourse.courseStatus === 'TEMPORARILY_WITHDRAWN',
  )

  const twelveMonthsAgo = sub(startOfToday(), { months: 12 })
  const coursesCompletedInLast12Months = [...completedCourses].filter(
    inPrisonCourse => inPrisonCourse.courseCompletionDate >= twelveMonthsAgo,
  )

  return {
    totalRecords: allCourses.length,
    coursesByStatus: {
      COMPLETED: completedCourses,
      IN_PROGRESS: inProgressCourses,
      WITHDRAWN: withdrawnCourses,
      TEMPORARILY_WITHDRAWN: temporarilyWithdrawnCourses,
    },
    coursesCompletedInLast12Months,
    hasCoursesCompletedMoreThan12MonthsAgo: () =>
      completedCourses.some(inPrisonCourse => inPrisonCourse.courseCompletionDate < twelveMonthsAgo),
    hasWithdrawnOrInProgressCourses: () =>
      withdrawnCourses.length + temporarilyWithdrawnCourses.length + inProgressCourses.length > 0,
  }
}

export default toInPrisonCourseRecords
