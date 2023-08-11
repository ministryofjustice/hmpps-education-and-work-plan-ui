import type { InPrisonEducationRecords } from 'viewModels'

/**
 * Returns a InPrisonEducationRecords object where the eduction records are filtered such that only the completed
 * courses are returned.
 */
const completedInPrisonEducationRecords = (
  allInPrisonEducationRecords: InPrisonEducationRecords,
): InPrisonEducationRecords => {
  return {
    ...allInPrisonEducationRecords,
    educationRecords: (allInPrisonEducationRecords.educationRecords || []).filter(
      inPrisonEducation => inPrisonEducation.courseCompleted === true,
    ),
  }
}

export default completedInPrisonEducationRecords
