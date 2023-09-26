import type { Step, Goal, ActionPlan } from 'viewModels'

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
    createdAt: '',
    updatedBy: 'asmith_gen',
    updatedByDisplayName: 'Alex Smith',
    updatedAt: '',
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

export { aValidActionPlanWithOneGoal, aValidGoal, aValidStep, anotherValidStep }
