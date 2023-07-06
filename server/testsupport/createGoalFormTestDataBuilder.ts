import type { CreateGoalForm } from 'forms'
import moment from 'moment/moment'

export default function aValidCreateGoalForm(): CreateGoalForm {
  return {
    prisonNumber: 'A1234BC',
    title: 'Learn Spanish',
    reviewDate: moment('2123-06-30', 'YYYY-MM-DD').toDate(),
    'reviewDate-day': '30',
    'reviewDate-month': '06',
    'reviewDate-year': '2123',
  }
}
