import type {
  ActionPlanResponse,
  GetGoalsResponse,
  GoalResponse,
  NoteResponse,
  StepResponse,
} from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goal, Step } from 'viewModels'
import toNote from './noteMapper'

const toActionPlan = (
  actionPlanResponse: ActionPlanResponse,
  problemRetrievingData: boolean,
  prisonNamesById: Record<string, string>,
): ActionPlan => {
  const goals = [...actionPlanResponse.goals].map(goal => toGoal(goal, prisonNamesById))
  return {
    prisonNumber: actionPlanResponse.prisonNumber,
    goals,
    problemRetrievingData,
  }
}

const toGoals = (response: GetGoalsResponse, prisonNamesById: Record<string, string>): Goal[] => {
  return [...response.goals].map(goal => toGoal(goal, prisonNamesById))
}

const toGoal = (goalResponse: GoalResponse, prisonNamesById: Record<string, string>): Goal => {
  return {
    goalReference: goalResponse.goalReference,
    title: goalResponse.title,
    status: goalResponse.status,
    steps: goalResponse.steps.map((step: StepResponse) => toStep(step)),
    createdBy: goalResponse.createdBy,
    createdByDisplayName: goalResponse.createdByDisplayName,
    createdAt: toDate(goalResponse.createdAt),
    createdAtPrisonName: prisonNamesById[goalResponse.createdAtPrison] || goalResponse.createdAtPrison,
    updatedBy: goalResponse.updatedBy,
    updatedByDisplayName: goalResponse.updatedByDisplayName,
    updatedAtPrisonName: prisonNamesById[goalResponse.updatedAtPrison] || goalResponse.updatedAtPrison,
    updatedAt: toDate(goalResponse.updatedAt),
    targetCompletionDate: toDate(goalResponse.targetCompletionDate),
    notesByType: {
      GOAL: goalResponse.goalNotes
        .filter((note: NoteResponse) => note.type === 'GOAL')
        .map((note: NoteResponse) => toNote(note, prisonNamesById)),
      GOAL_ARCHIVAL: goalResponse.goalNotes
        .filter((note: NoteResponse) => note.type === 'GOAL_ARCHIVAL')
        .map((note: NoteResponse) => toNote(note, prisonNamesById)),
      GOAL_COMPLETION: goalResponse.goalNotes
        .filter((note: NoteResponse) => note.type === 'GOAL_COMPLETION')
        .map((note: NoteResponse) => toNote(note, prisonNamesById)),
    },
    archiveReason: goalResponse.archiveReason,
    archiveReasonOther: goalResponse.archiveReasonOther,
  }
}

const toStep = (stepResponse: StepResponse): Step => {
  return {
    stepReference: stepResponse.stepReference,
    title: stepResponse.title,
    status: stepResponse.status,
    sequenceNumber: stepResponse.sequenceNumber,
  }
}

const toDate = (dateString: string): Date => {
  return dateString ? new Date(dateString) : null
}

export { toActionPlan, toGoal, toGoals }
