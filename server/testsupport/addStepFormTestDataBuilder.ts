import type { AddStepForm } from 'forms'
import moment from 'moment/moment'

export default function aValidAddStepFormWithOneStep(): AddStepForm {
  return {
    title: 'Book Spanish course',
    targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
  }
}
