import type { CreateGoalsRequest } from 'educationAndWorkPlanApiClient'
import {
  aValidCreateGoalRequestWithMultipleSteps,
  aValidCreateGoalRequestWithOneStep,
} from './createGoalRequestTestDataBuilder'

const aValidCreateGoalsRequestWithOneGoal = (prisonNumber = 'A1234BC'): CreateGoalsRequest => {
  return {
    goals: [aValidCreateGoalRequestWithOneStep(prisonNumber)],
  }
}

const aValidCreateGoalsRequestWitMultipleGoals = (prisonNumber = 'A1234BC'): CreateGoalsRequest => {
  return {
    goals: [aValidCreateGoalRequestWithOneStep(prisonNumber), aValidCreateGoalRequestWithMultipleSteps(prisonNumber)],
  }
}

export { aValidCreateGoalsRequestWithOneGoal, aValidCreateGoalsRequestWitMultipleGoals }
