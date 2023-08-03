import type { PrisonerSummary, PrisonerSupportNeeds } from 'viewModels'
import type { AddNoteForm, AddStepForm, CreateGoalForm, UpdateGoalForm } from 'forms'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    prisonerSummary: PrisonerSummary
    supportNeeds: PrisonerSupportNeeds
    createGoalForm: CreateGoalForm
    addStepForm: AddStepForm
    addStepForms: Array<AddStepForm>
    addNoteForm: AddNoteForm
    updateGoalForm: UpdateGoalForm
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      flash(type: string, message: Array<Record<string, string>>): number
      flash(message: 'errors'): Array<Record<string, string>>
    }
  }
}
