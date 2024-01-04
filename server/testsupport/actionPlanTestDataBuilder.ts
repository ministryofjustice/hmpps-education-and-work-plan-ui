import type { Step, Goal, ActionPlan } from 'viewModels'
import moment from 'moment'

const aValidActionPlan = (options?: {
  prisonNumber?: string
  goals?: Array<Goal>
  problemRetrievingData?: boolean
}): ActionPlan => {
  return {
    prisonNumber: options?.prisonNumber || 'A1234BC',
    goals: options?.goals || [aValidGoal()],
    problemRetrievingData:
      !options || options.problemRetrievingData === null || options.problemRetrievingData === undefined
        ? true
        : options.problemRetrievingData,
  }
}

/**
 * @deprecated - Use `aValidActionPlan` above because specifying a different collection of goals with this method makes
 * for code that is confusing to read and reason about.
 * EG:
 * ```
 * // create an action plan with 3 goals
 * const actionPlan = aValidActionPlanWithOneGoal(
 *  {
 *    goals: [aValidGoal(), aValidGoal(), aValidGoal()],
 *  }
 * )
 * ```
 */
const aValidActionPlanWithOneGoal = (
  prisonNumber = 'A1234BC',
  goals = [aValidGoal()],
  problemRetrievingData = false,
): ActionPlan => {
  return {
    prisonNumber,
    goals,
    problemRetrievingData,
  }
}

const aValidGoal = (
  goalReference = 'd38a6c41-13d1-1d05-13c2-24619966119b',
  steps = [aValidStep(), anotherValidStep()],
): Goal => {
  return {
    goalReference,
    title: 'Learn Spanish',
    status: 'ACTIVE',
    steps,
    createdBy: 'asmith_gen',
    createdByDisplayName: 'Alex Smith',
    createdAt: '2023-01-16',
    updatedBy: 'asmith_gen',
    updatedByDisplayName: 'Alex Smith',
    updatedAt: '2023-09-23',
    targetCompletionDate: moment('2024-02-29').toDate(),
    note: 'Prisoner is not good at listening',
  }
}

const aValidStep = (): Step => {
  return {
    stepReference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
    title: 'Book Spanish course',
    status: 'ACTIVE',
    sequenceNumber: 1,
  }
}

const anotherValidStep = (): Step => {
  return {
    stepReference: 'dc817ce8-2b2e-4282-96b2-b9a1d831fc56',
    title: 'Complete Spanish course',
    status: 'NOT_STARTED',
    sequenceNumber: 2,
  }
}

export { aValidActionPlan, aValidActionPlanWithOneGoal, aValidGoal, aValidStep, anotherValidStep }
