import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import type { CreateGoalDto } from 'dto'

export default class EducationAndWorkPlanApiMapper {
  createGoalDtoToCreateGoalRequest(createGoalDto: CreateGoalDto): CreateGoalRequest {
    const addStepRequest = {
      title: createGoalDto.steps[0].title,
      targetDate: createGoalDto.steps[0].targetDate,
      sequenceNumber: 1,
    } as CreateStepRequest
    const createGoalRequest = {
      prisonNumber: createGoalDto.prisonNumber,
      title: createGoalDto.title,
      category: 'WORK',
      reviewDate: createGoalDto.reviewDate,
      steps: [addStepRequest],
      note: createGoalDto.note,
    } as CreateGoalRequest

    return createGoalRequest
  }
}
