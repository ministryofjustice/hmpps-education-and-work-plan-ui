import type { Step, Goal, ActionPlan } from 'viewModels'

const aValidActionPlanWithOneGoal = (): ActionPlan => {
  return {
    prisonNumber: 'A1234BC',
    goals: [aValidGoal()],
    problemRetrievingData: false,
  }
}
const aValidGoal = (): Goal => {
  return {
    goalReference: 'd38a6c41-13d1-1d05-13c2-24619966119b',
    title: 'Learn Spanish',
    status: 'ACTIVE',
    steps: [aValidFirstStep(), aValidSecondStep()],
    createdBy: 'asmith_gen',
    createdByDisplayName: 'Alex Smith',
    createdAt: '',
    updatedBy: 'asmith_gen',
    updatedByDisplayName: 'Alex Smith',
    updatedAt: '',
    note: 'Prisoner is not good at listening',
  }
}

const aValidFirstStep = (): Step => {
  return {
    stepReference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
    title: 'Book Spanish course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    status: 'ACTIVE',
    sequenceNumber: 1,
  }
}

const aValidSecondStep = (): Step => {
  return {
    stepReference: 'dc817ce8-2b2e-4282-96b2-b9a1d831fc56',
    title: 'Complete Spanish course',
    targetDateRange: 'THREE_TO_SIX_MONTHS',
    status: 'NOT_STARTED',
    sequenceNumber: 2,
  }
}

export { aValidActionPlanWithOneGoal, aValidGoal }
