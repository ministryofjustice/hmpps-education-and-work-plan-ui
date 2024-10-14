import type {
  ActionPlanResponse,
  GetGoalsResponse,
  GoalResponse,
  NoteResponse,
  StepResponse,
} from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goal, Note, Step } from 'viewModels'

const toActionPlan = (
  actionPlanResponse: ActionPlanResponse,
  problemRetrievingData: boolean,
  prisonNamesById: Map<string, string>,
): ActionPlan => {
  const goals = [...actionPlanResponse.goals].map(goal => toGoal(goal, prisonNamesById))
  return {
    prisonNumber: actionPlanResponse.prisonNumber,
    goals,
    problemRetrievingData,
  }
}

const toGoals = (response: GetGoalsResponse, prisonNamesById: Map<string, string>): Goal[] => {
  return [...response.goals].map(goal => toGoal(goal, prisonNamesById))
}

const toGoal = (goalResponse: GoalResponse, prisonNamesById: Map<string, string>): Goal => {
  return {
    goalReference: goalResponse.goalReference,
    title: goalResponse.title,
    status: goalResponse.status,
    steps: goalResponse.steps.map((step: StepResponse) => toStep(step)),
    createdBy: goalResponse.createdBy,
    createdByDisplayName: goalResponse.createdByDisplayName,
    createdAt: toDate(goalResponse.createdAt),
    createdAtPrisonName: prisonNamesById.get(goalResponse.createdAtPrison) || goalResponse.createdAtPrison,
    updatedBy: goalResponse.updatedBy,
    updatedByDisplayName: goalResponse.updatedByDisplayName,
    updatedAtPrisonName: prisonNamesById.get(goalResponse.updatedAtPrison) || goalResponse.updatedAtPrison,
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

const toNote = (noteResponse: NoteResponse, prisonNamesById: Map<string, string>): Note => ({
  reference: noteResponse.reference,
  content: noteResponse.content,
  type: noteResponse.type,
  createdBy: noteResponse.createdBy,
  createdByDisplayName: noteResponse.createdByDisplayName,
  createdAt: toDate(noteResponse.createdAt),
  createdAtPrisonName: prisonNamesById.get(noteResponse.createdAtPrison) || noteResponse.createdAtPrison,
  updatedBy: noteResponse.updatedBy,
  updatedByDisplayName: noteResponse.updatedByDisplayName,
  updatedAt: toDate(noteResponse.updatedAt),
  updatedAtPrisonName: prisonNamesById.get(noteResponse.updatedAtPrison) || noteResponse.updatedAtPrison,
})

const toDate = (dateString: string): Date => {
  return dateString ? new Date(dateString) : null
}

export { toActionPlan, toGoal, toGoals }
