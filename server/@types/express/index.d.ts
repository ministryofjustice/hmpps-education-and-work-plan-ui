import type { PrisonerSummary, PrisonerSupportNeeds } from 'viewModels'
import type { UpdateGoalForm } from 'forms'
import type { NewGoal } from 'compositeForms'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    prisonerSummary: PrisonerSummary
    supportNeeds: PrisonerSupportNeeds
    newGoal: NewGoal // A single NewGoal representing the Goal that is currently being added
    newGoals: Array<NewGoal> // An array of NewGoal representing the Goals that have been added
    updateGoalForm: UpdateGoalForm
    prisonerListSortOptions: string
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
