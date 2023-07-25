import type { ActionPlanDto, CreateGoalDto } from 'dto'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'

export default class EducationAndWorkPlanService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async createGoal(createGoalDto: CreateGoalDto, token: string): Promise<void> {
    return this.educationAndWorkPlanClient.createGoal(createGoalDto, token)
  }

  async getActionPlan(prisonNumber: string, token: string): Promise<ActionPlanDto> {
    return this.educationAndWorkPlanClient.getActionPlan(prisonNumber, token)
  }
}
