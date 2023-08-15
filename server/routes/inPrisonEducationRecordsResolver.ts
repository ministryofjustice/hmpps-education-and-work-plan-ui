import type { InPrisonEducation, InPrisonEducationRecords } from 'viewModels'
import dateComparator from './dateComparator'

/**
 * Returns an InPrisonEducationRecords object where the eduction records are filtered such that only the completed
 * courses are returned.
 */
const completedInPrisonEducationRecords = (
  allInPrisonEducationRecords: InPrisonEducationRecords,
): InPrisonEducationRecords => {
  return {
    ...allInPrisonEducationRecords,
    educationRecords: (allInPrisonEducationRecords.educationRecords || [])
      .filter(inPrisonEducation => inPrisonEducation.courseCompleted === true)
      .sort((left: InPrisonEducation, right: InPrisonEducation) =>
        dateComparator(left.courseCompletionDate, right.courseCompletionDate),
      ),
  }
}

/**
 * Returns an InPrisonEducationRecords object where the eduction records are filtered such that only the n most recent
 * completed courses are returned; where n is the parameter `numberOfRecordsToReturn`. The default if not specified is 2.
 */
const mostRecentCompletedInPrisonEducationRecords = (
  allInPrisonEducationRecords: InPrisonEducationRecords,
  numberOfRecordsToReturn = 2,
): InPrisonEducationRecords => {
  const allCompletedInPrisonEducationRecords = completedInPrisonEducationRecords(allInPrisonEducationRecords)
  return {
    ...allCompletedInPrisonEducationRecords,
    educationRecords: allCompletedInPrisonEducationRecords.educationRecords.slice(0, numberOfRecordsToReturn),
  }
}

export { completedInPrisonEducationRecords, mostRecentCompletedInPrisonEducationRecords }
