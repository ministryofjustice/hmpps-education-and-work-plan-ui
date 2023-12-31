import type { CreateGoalForm } from 'forms'

const aValidCreateGoalForm = (options?: {
  prisonNumber?: string
  title?: string
  targetCompletionDate?: string
}): CreateGoalForm => {
  return {
    prisonNumber: options?.prisonNumber || 'A1234BC',
    title: options?.title || 'Learn Spanish',
    targetCompletionDate: options?.targetCompletionDate || '2024-02-29',
    'targetCompletionDate-day': null,
    'targetCompletionDate-month': null,
    'targetCompletionDate-year': null,
  }
}

const aValidCreateGoalFormWithIndividualTargetDateFields = (title = 'Learn Spanish'): CreateGoalForm => {
  return {
    prisonNumber: 'A1234BC',
    title,
    targetCompletionDate: 'another-date',
    'targetCompletionDate-day': '29',
    'targetCompletionDate-month': '02',
    'targetCompletionDate-year': '2024',
  }
}

const aValidCreateGoalFormDuringDaylightSavingTime = (title = 'Learn Spanish'): CreateGoalForm => {
  return {
    prisonNumber: 'A1234BC',
    title,
    targetCompletionDate: '2024-06-29',
    'targetCompletionDate-day': null,
    'targetCompletionDate-month': null,
    'targetCompletionDate-year': null,
  }
}

export {
  aValidCreateGoalForm,
  aValidCreateGoalFormWithIndividualTargetDateFields,
  aValidCreateGoalFormDuringDaylightSavingTime,
}
