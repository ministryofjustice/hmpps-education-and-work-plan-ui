import type { CreateGoalsRequest } from 'educationAndWorkPlanApiClient'
import {
  aValidCreateGoalRequestWithMultipleSteps,
  aValidCreateGoalRequestWithOneStep,
} from './createGoalRequestTestDataBuilder'

const aValidCreateGoalsRequestWithOneGoal = (): CreateGoalsRequest => {
  return {
    goals: [aValidCreateGoalRequestWithOneStep()],
  }
}

const aValidCreateGoalsRequestWitMultipleGoals = (): CreateGoalsRequest => {
  return {
    goals: [aValidCreateGoalRequestWithOneStep(), aValidCreateGoalRequestWithMultipleSteps()],
  }
}

export { aValidCreateGoalsRequestWithOneGoal, aValidCreateGoalsRequestWitMultipleGoals }
