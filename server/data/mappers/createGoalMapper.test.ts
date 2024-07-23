import type { CreateGoalDto } from 'dto'
import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import { parse, startOfToday } from 'date-fns'
import { toCreateGoalRequest } from './createGoalMapper'
import { aValidCreateGoalDtoWithMultipleSteps } from '../../testsupport/createGoalDtoTestDataBuilder'

describe('createGoalMapper', () => {
  const today = startOfToday()

  it('should map to CreateGoalRequest given a valid DTO whose targetCompletionDate is not in BST', () => {
    // Given
    const createGoalDto: CreateGoalDto = aValidCreateGoalDtoWithMultipleSteps()
    createGoalDto.targetCompletionDate = parse('2024-01-01', 'yyyy-MM-dd', today) // January is not BST

    const expectedAddStepRequest1: CreateStepRequest = {
      title: createGoalDto.steps[0].title,
      sequenceNumber: 1,
    }
    const expectedAddStepRequest2: CreateStepRequest = {
      title: createGoalDto.steps[1].title,
      sequenceNumber: 2,
    }
    const expectedCreateGoalRequest: CreateGoalRequest = {
      title: createGoalDto.title,
      steps: [expectedAddStepRequest1, expectedAddStepRequest2],
      targetCompletionDate: '2024-01-01',
      notes: createGoalDto.note,
      prisonId: createGoalDto.prisonId,
    }

    // When
    const actual = toCreateGoalRequest(createGoalDto)

    // Then
    expect(actual).toEqual(expectedCreateGoalRequest)
  })

  it('should map to CreateGoalRequest given a valid DTO whose targetCompletionDate is in BST', () => {
    // Given
    const createGoalDto: CreateGoalDto = aValidCreateGoalDtoWithMultipleSteps()
    createGoalDto.targetCompletionDate = parse('2024-08-10', 'yyyy-MM-dd', today) // August is BST

    const expectedAddStepRequest1: CreateStepRequest = {
      title: createGoalDto.steps[0].title,
      sequenceNumber: 1,
    }
    const expectedAddStepRequest2: CreateStepRequest = {
      title: createGoalDto.steps[1].title,
      sequenceNumber: 2,
    }
    const expectedCreateGoalRequest: CreateGoalRequest = {
      title: createGoalDto.title,
      steps: [expectedAddStepRequest1, expectedAddStepRequest2],
      targetCompletionDate: '2024-08-10',
      notes: createGoalDto.note,
      prisonId: createGoalDto.prisonId,
    }

    // When
    const actual = toCreateGoalRequest(createGoalDto)

    // Then
    expect(actual).toEqual(expectedCreateGoalRequest)
  })
})
