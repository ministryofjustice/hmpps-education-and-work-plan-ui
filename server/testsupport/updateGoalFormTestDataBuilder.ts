import type { UpdateGoalForm } from 'forms'

export default function aValidUpdateGoalForm(reference = '95b18362-fe56-4234-9ad2-11ef98b974a3'): UpdateGoalForm {
  return {
    reference,
    title: 'Learn Spanish',
    targetCompletionDate: undefined,
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
