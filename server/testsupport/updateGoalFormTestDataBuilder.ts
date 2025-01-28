import type { UpdateGoalForm } from 'forms'
import GoalStatusValue from '../enums/goalStatusValue'
import StepStatusValue from '../enums/stepStatusValue'

const aValidUpdateGoalForm = (reference = '95b18362-fe56-4234-9ad2-11ef98b974a3'): UpdateGoalForm => {
  return {
    reference,
    title: 'Learn Spanish',
    createdAt: '2023-01-16',
    targetCompletionDate: '2024-02-29',
    'targetCompletionDate-day': null,
    'targetCompletionDate-month': null,
    'targetCompletionDate-year': null,
    note: 'Prisoner is not good at listening',
    steps: [
      {
        reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
        title: 'Book course',
        stepNumber: 1,
        status: StepStatusValue.ACTIVE,
      },
      {
        reference: 'f2bf8af7-dd89-4305-b312-3a7fbe2d41a3',
        title: 'Attend course',
        stepNumber: 2,
        status: StepStatusValue.NOT_STARTED,
      },
    ],
    action: 'submit-form',
    originalTargetCompletionDate: '2024-02-29',
    status: GoalStatusValue.ACTIVE,
  }
}

const aValidUpdateGoalFormWithIndividualTargetDateFields = (
  reference = '95b18362-fe56-4234-9ad2-11ef98b974a3',
): UpdateGoalForm => {
  return {
    reference,
    title: 'Learn Spanish',
    createdAt: '2023-01-16',
    targetCompletionDate: 'another-date',
    'targetCompletionDate-day': '29',
    'targetCompletionDate-month': '02',
    'targetCompletionDate-year': '2024',
    note: 'Prisoner is not good at listening',
    steps: [
      {
        reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
        title: 'Book course',
        stepNumber: 1,
        status: StepStatusValue.ACTIVE,
      },
    ],
    action: 'submit-form',
    originalTargetCompletionDate: '2024-02-29',
    status: GoalStatusValue.ACTIVE,
  }
}

const aValidUpdateGoalFormDuringDaylightSavingTime = (
  reference = '95b18362-fe56-4234-9ad2-11ef98b974a3',
): UpdateGoalForm => {
  return {
    reference,
    title: 'Learn Spanish',
    createdAt: '2023-01-16',
    targetCompletionDate: '2024-06-29',
    'targetCompletionDate-day': null,
    'targetCompletionDate-month': null,
    'targetCompletionDate-year': null,
    note: 'Prisoner is not good at listening',
    steps: [
      {
        reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
        title: 'Book course',
        stepNumber: 1,
        status: StepStatusValue.ACTIVE,
      },
    ],
    action: 'submit-form',
    originalTargetCompletionDate: '2024-06-29',
    status: GoalStatusValue.ACTIVE,
  }
}

export {
  aValidUpdateGoalForm,
  aValidUpdateGoalFormWithIndividualTargetDateFields,
  aValidUpdateGoalFormDuringDaylightSavingTime,
}
