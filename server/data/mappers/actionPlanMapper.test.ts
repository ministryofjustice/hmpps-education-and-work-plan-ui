import type { ActionPlanResponse } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goal, Step } from 'viewModels'
import { toActionPlan } from './actionPlanMapper'
import { aValidActionPlanResponseWithOneGoal } from '../../testsupport/actionPlanResponseTestDataBuilder'

describe('actionPlanMapper', () => {
  it('should map to ActionPlan given valid ActionPlanResponse', () => {
    // Given
    const actionPlanResponse: ActionPlanResponse = aValidActionPlanResponseWithOneGoal()
    const problemRetrievingData = false
    const expectedFirstStep = {
      stepReference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
      title: 'Book Spanish course',
      status: 'ACTIVE',
      sequenceNumber: 1,
    } as Step
    const expectedSecondStep = {
      stepReference: 'dc817ce8-2b2e-4282-96b2-b9a1d831fc56',
      title: 'Complete Spanish course',
      status: 'NOT_STARTED',
      sequenceNumber: 2,
    } as Step
    const expectedGoal = {
      goalReference: 'd38a6c41-13d1-1d05-13c2-24619966119b',
      title: 'Learn Spanish',
      status: 'ACTIVE',
      steps: [expectedFirstStep, expectedSecondStep],
      targetCompletionDate: undefined,
      createdBy: 'asmith_gen',
      createdByDisplayName: 'Alex Smith',
      createdAt: '',
      updatedBy: 'asmith_gen',
      updatedByDisplayName: 'Alex Smith',
      updatedAt: '',
      note: 'Prisoner is not good at listening',
    } as Goal
    const expectedActionPlan = {
      prisonNumber: actionPlanResponse.prisonNumber,
      goals: [expectedGoal],
      problemRetrievingData: false,
    } as ActionPlan

    // When
    const actionPlan = toActionPlan(actionPlanResponse, problemRetrievingData)

    // Then
    expect(actionPlan).toEqual(expectedActionPlan)
  })
})
