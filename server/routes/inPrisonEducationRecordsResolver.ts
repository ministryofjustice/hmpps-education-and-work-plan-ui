import type { InPrisonEducation, InPrisonEducationRecords } from 'viewModels'
import dateComparator from './dateComparator'

/**
 * Returns a InPrisonEducationRecords object where the eduction records are filtered such that only the completed
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

export default completedInPrisonEducationRecords
