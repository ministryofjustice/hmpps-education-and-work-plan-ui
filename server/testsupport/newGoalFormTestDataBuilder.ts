import type { NewGoal } from 'compositeForms'
import type { AddNoteForm, AddStepForm, CreateGoalForm } from 'forms'
import { aValidCreateGoalForm } from './createGoalFormTestDataBuilder'
import { aValidAddStepForm } from './addStepFormTestDataBuilder'
import aValidAddNoteForm from './addNoteFormTestDataBuilder'

export default function aValidNewGoalForm(options?: {
  createGoalForm?: CreateGoalForm
  addStepForms?: Array<AddStepForm>
  addNoteForm?: AddNoteForm
}): NewGoal {
  return {
    createGoalForm: options?.createGoalForm || aValidCreateGoalForm(),
    addStepForm: undefined,
    addStepForms: options?.addStepForms || [aValidAddStepForm(), aValidAddStepForm()],
    addNoteForm: options?.addNoteForm || aValidAddNoteForm(),
  }
}
