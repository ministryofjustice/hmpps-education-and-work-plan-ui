import moment from 'moment'
import type { LearnerEducation } from 'curiousApiClient'
import type { PrisonerEducation } from 'viewModels'

const toPrisonerEducation = (apiLearnerEducation: LearnerEducation): PrisonerEducation => {
  return {
    prisonId: apiLearnerEducation.establishmentId,
    prisonName: apiLearnerEducation.establishmentName,
    courseCode: apiLearnerEducation.courseCode,
    courseName: apiLearnerEducation.courseName,
    courseStartDate: moment(apiLearnerEducation.learningStartDate).toDate(),
    source: 'CURIOUS',
  }
}

export default toPrisonerEducation
