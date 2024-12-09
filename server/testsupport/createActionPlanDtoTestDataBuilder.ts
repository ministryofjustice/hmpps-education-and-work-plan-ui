import type { CreateActionPlanDto, CreateGoalDto } from 'dto'
import { aValidCreateGoalDtoWithOneStep } from './createGoalDtoTestDataBuilder'

const aValidCreateActionPlanDto = (options?: {
  prisonNumber?: string
  goals?: Array<CreateGoalDto>
}): CreateActionPlanDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  goals: options?.goals || [aValidCreateGoalDtoWithOneStep()],
})

export default aValidCreateActionPlanDto
