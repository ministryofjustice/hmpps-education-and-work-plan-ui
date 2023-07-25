import type { ActionPlanResponse } from 'educationAndWorkPlanApiClient'
import type { ActionPlanDto, GoalDto, StepDto } from 'dto'
import { toActionPlanDto } from './actionPlanMapper'
import { aValidActionPlanResponseWithOneGoal } from '../../testsupport/actionPlanResponseTestDataBuilder'

describe('actionPlanMapper', () => {
  it('should map to ActionPlanDto given valid ActionPlanResponse', () => {
    // Given
    const actionPlanResponse: ActionPlanResponse = aValidActionPlanResponseWithOneGoal()
    const expectedFirstStepDto = {
      stepReference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
      title: 'Book Spanish course',
      targetDateRange: 'ZERO_TO_THREE_MONTHS',
      status: 'ACTIVE',
      sequenceNumber: 1,
    } as StepDto
    const expectedSecondStepDto = {
      stepReference: 'dc817ce8-2b2e-4282-96b2-b9a1d831fc56',
      title: 'Complete Spanish course',
      targetDateRange: 'THREE_TO_SIX_MONTHS',
      status: 'NOT_STARTED',
      sequenceNumber: 2,
    } as StepDto
    const expectedGoal = {
      goalReference: 'd38a6c41-13d1-1d05-13c2-24619966119b',
      title: 'Learn Spanish',
      status: 'ACTIVE',
      steps: [expectedFirstStepDto, expectedSecondStepDto],
      reviewDate: undefined,
      createdBy: 'asmith_gen',
      createdByDisplayName: 'Alex Smith',
      createdAt: '',
      updatedBy: 'asmith_gen',
      updatedByDisplayName: 'Alex Smith',
      updatedAt: '',
      note: 'Prisoner is not good at listening',
    } as GoalDto
    const expectedActionPlanDto = {
      prisonNumber: actionPlanResponse.prisonNumber,
      goals: [expectedGoal],
    } as ActionPlanDto

    // When
    const actionPlanDto = toActionPlanDto(actionPlanResponse)

    // Then
    expect(actionPlanDto).toEqual(expectedActionPlanDto)
  })
})
