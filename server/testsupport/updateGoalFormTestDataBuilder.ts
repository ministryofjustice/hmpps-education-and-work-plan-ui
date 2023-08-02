import type { UpdateGoalForm } from 'forms'

export default function aValidUpdateGoalForm(): UpdateGoalForm {
  return {
    reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
    title: 'Learn Spanish',
    reviewDate: undefined,
    status: 'ACTIVE',
    steps: [
      {
        reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
        title: 'Book course',
        targetDateRange: 'ZERO_TO_THREE_MONTHS',
        stepNumber: 1,
        status: 'ACTIVE',
      },
      {
        reference: 'f2bf8af7-dd89-4305-b312-3a7fbe2d41a3',
        title: 'Attend course',
        targetDateRange: 'SIX_TO_TWELVE_MONTHS',
        stepNumber: 2,
        status: 'NOT_STARTED',
      },
    ],
  }
}
