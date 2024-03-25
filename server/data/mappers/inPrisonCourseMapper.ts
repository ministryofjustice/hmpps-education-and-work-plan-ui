import moment from 'moment'
import type { LearnerEducation } from 'curiousApiClient'
import type { InPrisonCourse } from 'viewModels'

const toInPrisonCourse = (apiLearnerEducation: LearnerEducation): InPrisonCourse => {
  return {
    prisonId: apiLearnerEducation.establishmentId,
    prisonName: apiLearnerEducation.establishmentName,
    courseCode: apiLearnerEducation.courseCode,
    courseName: apiLearnerEducation.courseName,
    courseStartDate: moment(apiLearnerEducation.learningStartDate).utc().toDate(),
    courseStatus: toCourseStatus(apiLearnerEducation.completionStatus),
    courseCompletionDate: apiLearnerEducation.learningActualEndDate
      ? moment(apiLearnerEducation.learningActualEndDate).utc().toDate()
      : null,
    coursePlannedEndDate: apiLearnerEducation.learningPlannedEndDate
      ? moment(apiLearnerEducation.learningPlannedEndDate).utc().toDate()
      : null,
    isAccredited: apiLearnerEducation.isAccredited,
    grade: apiLearnerEducation.outcomeGrade || apiLearnerEducation.outcome || null,
    source: 'CURIOUS',
  }
}

/**
 * Returns one of 'COMPLETED' | 'IN_PROGRESS' | 'WITHDRAWN' | 'TEMPORARILY_WITHDRAWN' to represent the course status.
 * Logic is based on the field `completionStatus` in the Curious API response object which (contrary to the swagger spec)
 * has one of four fixed values. The values look like free text field, but are actually the screen labels for the Curious
 * drop down field.
 *
 * The four possible values are:
 *   * `The learner is continuing or intending to continue the learning activities leading to the learning aim` = IN_PROGRESS
 *   * `The learner has completed the learning activities leading to the learning aim`                          = COMPLETED
 *   * `The learner has withdrawn from the learning activities leading to the learning aim`                     = WITHDRAWN
 *   * `Learner has temporarily withdrawn from the aim due to an agreed break in learning`                      = TEMPORARILY_WITHDRAWN
 *
 * The matching logic is based on matching relevant words in the screen label in order to not make this function too
 * brittle and allow for the Curious screen labels to change slightly without breaking this logic.
 * There is no known process for communication in changes of the Curious screen labels to dependant services such as
 * this, so there is a risk that this logic could break in the future, though the use of matching on relevant words
 * rather than the whole string should minimise this as far as practical.
 */
const toCourseStatus = (
  completionStatus: string,
): 'COMPLETED' | 'IN_PROGRESS' | 'WITHDRAWN' | 'TEMPORARILY_WITHDRAWN' => {
  const statusScreenLabel = completionStatus.toUpperCase()
  if (statusScreenLabel.includes('WITHDRAWN')) {
    if (statusScreenLabel.includes('TEMPORARILY')) {
      return 'TEMPORARILY_WITHDRAWN'
    }
    return 'WITHDRAWN'
  }

  if (statusScreenLabel.includes('COMPLETED')) {
    return 'COMPLETED'
  }

  return 'IN_PROGRESS'
}

export { toInPrisonCourse, toCourseStatus }
