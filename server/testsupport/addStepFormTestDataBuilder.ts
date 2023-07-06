import type { AddStepForm } from 'forms'
import moment from 'moment/moment'

const aValidAddStepForm = (): AddStepForm => {
  return {
    stepNumber: 1,
    title: 'Book Spanish course',
    targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
    'targetDate-day': '31',
    'targetDate-month': '01',
    'targetDate-year': '2123',
    action: 'submit-form',
  }
}

const anotherValidAddStepForm = (): AddStepForm => {
  return {
    stepNumber: 2,
    title: 'Complete Spanish course',
    targetDate: moment('2123-03-31', 'YYYY-MM-DD').toDate(),
    'targetDate-day': '31',
    'targetDate-month': '03',
    'targetDate-year': '2123',
    action: 'submit-form',
  }
}

export { aValidAddStepForm, anotherValidAddStepForm }
