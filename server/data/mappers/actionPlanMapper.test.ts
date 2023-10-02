import moment from 'moment'
import type { ActionPlanResponse } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goal, Step } from 'viewModels'
import { toActionPlan } from './actionPlanMapper'
import { aValidActionPlanResponseWithOneGoal } from '../../testsupport/actionPlanResponseTestDataBuilder'

describe('actionPlanMapper', () => {
  it('should map to ActionPlan given valid ActionPlanResponse', () => {
    // Given
    const actionPlanResponse: ActionPlanResponse = aValidActionPlanResponseWithOneGoal()
    const problemRetrievingData = false
    const expectedFirstStep: Step = {
      stepReference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
      title: 'Book Spanish course',
      status: 'ACTIVE',
      sequenceNumber: 1,
    }
    const expectedSecondStep: Step = {
      stepReference: 'dc817ce8-2b2e-4282-96b2-b9a1d831fc56',
      title: 'Complete Spanish course',
      status: 'NOT_STARTED',
      sequenceNumber: 2,
    }
    const expectedGoal: Goal = {
      goalReference: 'd38a6c41-13d1-1d05-13c2-24619966119b',
      title: 'Learn Spanish',
      status: 'ACTIVE',
      steps: [expectedFirstStep, expectedSecondStep],
      targetCompletionDate: moment('2024-02-29').toDate(),
      createdBy: 'asmith_gen',
      createdByDisplayName: 'Alex Smith',
      createdAt: '2023-01-16',
      updatedBy: 'asmith_gen',
      updatedByDisplayName: 'Alex Smith',
      updatedAt: '2023-09-23',
      note: 'Prisoner is not good at listening',
    }
    const expectedActionPlan: ActionPlan = {
      prisonNumber: actionPlanResponse.prisonNumber,
      goals: [expectedGoal],
      problemRetrievingData: false,
    }

    // When
    const actionPlan = toActionPlan(actionPlanResponse, problemRetrievingData)

    // Then
    expect(actionPlan).toEqual(expectedActionPlan)
  })
})
