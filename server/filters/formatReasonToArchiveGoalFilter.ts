export default function formatReasonToArchiveGoalFilter(value: string): string {
  if (value === null || value === undefined) {
    return undefined
  }
  if (typeof value === 'string') {
    if (value.toUpperCase() === 'PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL') {
      return 'Prisoner no longer wants to work towards this goal'
    }
    if (value.toUpperCase() === 'SUITABLE_ACTIVITIES_NOT_AVAILABLE_IN_THIS_PRISON') {
      return 'Work or education activity needed to complete goal is not available in this prison'
    }
    if (value.toUpperCase() === 'PRISONER_NO_LONGER_WANTS_TO_WORK_WITH_CIAG') {
      return 'Prisoner no longer wants to work with careers, information and guidance advisors'
    }
    if (value.toUpperCase() === 'OTHER') {
      return 'Other'
    }
    return undefined
  }

  return undefined
}
