import type { UpdateGoalForm } from 'forms'

const aValidUpdateGoalForm = (reference = '95b18362-fe56-4234-9ad2-11ef98b974a3'): UpdateGoalForm => {
  return {
    reference,
    title: 'Learn Spanish',
    createdAt: '2023-01-16',
    targetCompletionDate: '2024-02-29',
    'targetCompletionDate-day': null,
    'targetCompletionDate-month': null,
    'targetCompletionDate-year': null,
    status: 'ACTIVE',
    note: 'Prisoner is not good at listening',
    steps: [
      {
        reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
        title: 'Book course',
        stepNumber: 1,
        status: 'ACTIVE',
      },
      {
        reference: 'f2bf8af7-dd89-4305-b312-3a7fbe2d41a3',
        title: 'Attend course',
        stepNumber: 2,
        status: 'NOT_STARTED',
      },
    ],
    action: 'submit-form',
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
    status: 'ACTIVE',
    note: 'Prisoner is not good at listening',
    steps: [
      {
        reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
        title: 'Book course',
        stepNumber: 1,
        status: 'ACTIVE',
      },
    ],
    action: 'submit-form',
  }
}

export { aValidUpdateGoalForm, aValidUpdateGoalFormWithIndividualTargetDateFields }
