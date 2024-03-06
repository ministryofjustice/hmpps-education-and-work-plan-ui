import moment from 'moment'
import type { LearnerEducation } from 'curiousApiClient'
import type { InPrisonEducation } from 'viewModels'

const toInPrisonEducation = (apiLearnerEducation: LearnerEducation): InPrisonEducation => {
  return {
    prisonId: apiLearnerEducation.establishmentId,
    prisonName: apiLearnerEducation.establishmentName,
    courseCode: apiLearnerEducation.courseCode,
    courseName: apiLearnerEducation.courseName,
    courseStartDate: moment(apiLearnerEducation.learningStartDate).toDate(),
    courseCompleted: !!apiLearnerEducation.learningActualEndDate,
    courseCompletionDate: apiLearnerEducation.learningActualEndDate
      ? moment(apiLearnerEducation.learningActualEndDate).toDate()
      : null,
    isAccredited: apiLearnerEducation.isAccredited,
    grade: apiLearnerEducation.outcomeGrade || apiLearnerEducation.outcome || null,
    source: 'CURIOUS',
  }
}

export default toInPrisonEducation
