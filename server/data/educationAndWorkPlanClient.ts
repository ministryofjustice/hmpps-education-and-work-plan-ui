import type { CreateGoalDto } from 'dto'
import RestClient from './restClient'
import config from '../config'
import EducationAndWorkPlanApiMapper from './educationAndWorkPlanApiMapper'

export default class EducationAndWorkPlanClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Education and Work Plan API Client', config.apis.educationAndWorkPlan, token)
  }

  private static educationAndWorkPlanApiMapper(): EducationAndWorkPlanApiMapper {
    return new EducationAndWorkPlanApiMapper()
  }

  async createGoal(createGoalDto: CreateGoalDto, token: string): Promise<void> {
    const createGoalRequest =
      EducationAndWorkPlanClient.educationAndWorkPlanApiMapper().toCreateGoalRequest(createGoalDto)

    await EducationAndWorkPlanClient.restClient(token).post({
      path: `/action-plans/${createGoalRequest.prisonNumber}/goals`,
      data: createGoalRequest,
    })
  }
}
