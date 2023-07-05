import type { CreateGoalDto } from 'dto'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'

export default class EducationAndWorkPlanService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async createGoal(createGoalDto: CreateGoalDto, token: string): Promise<void> {
    return this.educationAndWorkPlanClient.createGoal(createGoalDto, token)
  }
}
