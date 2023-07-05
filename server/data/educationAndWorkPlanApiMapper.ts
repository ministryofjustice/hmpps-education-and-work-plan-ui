import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import type { CreateGoalDto } from 'dto'

export default class EducationAndWorkPlanApiMapper {
  toCreateGoalRequest(createGoalDto: CreateGoalDto): CreateGoalRequest {
    const addStepRequest: CreateStepRequest = {
      title: createGoalDto.steps[0].title,
      targetDate: createGoalDto.steps[0].targetDate,
      sequenceNumber: 1,
    }
    const createGoalRequest: CreateGoalRequest = {
      prisonNumber: createGoalDto.prisonNumber,
      title: createGoalDto.title,
      category: 'WORK',
      reviewDate: createGoalDto.reviewDate,
      steps: [addStepRequest],
      note: createGoalDto.note,
    }

    return createGoalRequest
  }
}
