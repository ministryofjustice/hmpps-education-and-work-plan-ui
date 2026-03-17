import { startOfDay } from 'date-fns'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'

export default class AiGoalService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async generateSuggestedGoal(prisonNumber: string, username: string): Promise<SuggestedGoal> {
    const suggestedGoal = await this.educationAndWorkPlanClient.generateSuggestedGoal(prisonNumber, username)

    return {
      ...suggestedGoal,
      completionDate: startOfDay(suggestedGoal.completionDate),
    }
  }
}

export type SuggestedGoal = {
  title: string
  description: string
  completionDate: Date
  steps: Array<string>
  specific: string
  measurable: string
  achievable: string
  relevant: string
  timeBound: string
}
