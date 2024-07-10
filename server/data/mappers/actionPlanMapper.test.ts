import type { ActionPlanResponse, GetGoalsResponse, GoalResponse } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goal, Step } from 'viewModels'
import { toActionPlan, toGoals } from './actionPlanMapper'
import {
  aValidActionPlanResponseWithOneGoal,
  aValidGoalResponse,
} from '../../testsupport/actionPlanResponseTestDataBuilder'

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
      targetCompletionDate: new Date('2024-02-29T00:00:00.000Z'),
      createdBy: 'asmith_gen',
      createdByDisplayName: 'Alex Smith',
      createdAt: new Date('2023-01-16T09:34:12.453Z'),
      updatedBy: 'asmith_gen',
      updatedByDisplayName: 'Alex Smith',
      updatedAt: new Date('2023-09-23T13:42:01.401Z'),
      note: 'Prisoner is not good at listening',
      sequenceNumber: 1,
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

  it('should map to ActionPlan given valid ActionPlanResponse containing several goals', () => {
    // Given
    const problemRetrievingData = false

    const mathsGoal: GoalResponse = {
      ...aValidGoalResponse(),
      goalReference: 'd81c94d1-6818-4093-9e3b-196e138aa4c9',
      title: 'Pass GCSE Maths',
      createdAt: '2023-02-03T15:16:51.516Z', // Maths goal was created last and is the newest
      updatedAt: '2023-09-23T13:42:01.401Z',
    }
    const englishGoal: GoalResponse = {
      ...aValidGoalResponse(),
      goalReference: 'e9ea55d5-cc97-4446-8add-48e3aecc4ca5',
      title: 'Pass GCSE English',
      createdAt: '2023-01-16T09:34:12.453Z', // English goal was created first and is the oldest
      updatedAt: '2023-04-07T11:17:31.713Z',
    }
    const spanishGoal: GoalResponse = {
      ...aValidGoalResponse(),
      goalReference: '3d566996-2fe0-406c-8b99-66621ff7a7b8',
      title: 'Pass GCSE Spanish',
      createdAt: '2023-01-16T09:37:52.182Z', // Spanish goal was created 2 minutes after the English goal
      updatedAt: '2023-01-16T09:37:52.182Z',
    }

    const actionPlanResponse: ActionPlanResponse = {
      prisonNumber: 'A1234BC',
      goals: [mathsGoal, spanishGoal, englishGoal], // Goals are returned from the API in createdBy order descending
    }

    // When
    const actionPlan = toActionPlan(actionPlanResponse, problemRetrievingData)

    // Then
    // Expect goals to be in updatedAt order descending with a sequence number derived from their order of date creation
    expect(actionPlan.goals[0].title).toEqual('Pass GCSE Maths')
    expect(actionPlan.goals[0].sequenceNumber).toEqual(3) // Maths goal is the newest, so we expect it to be goal 3
    expect(actionPlan.goals[1].title).toEqual('Pass GCSE Spanish')
    expect(actionPlan.goals[1].sequenceNumber).toEqual(2) // Spanish goal is in the middle, so we expect it to be goal 2
    expect(actionPlan.goals[2].title).toEqual('Pass GCSE English')
    expect(actionPlan.goals[2].sequenceNumber).toEqual(1) // English goal is the oldest, so we expect it to be goal 1
  })

  it('should map to goals given valid GoalsResponse containing several goals', () => {
    // Given
    const mathsGoal: GoalResponse = {
      ...aValidGoalResponse(),
      goalReference: 'd81c94d1-6818-4093-9e3b-196e138aa4c9',
      title: 'Pass GCSE Maths',
      createdAt: '2023-02-03T15:16:51.516Z', // Maths goal was created last and is the newest
      updatedAt: '2023-09-23T13:42:01.401Z',
    }
    const englishGoal: GoalResponse = {
      ...aValidGoalResponse(),
      goalReference: 'e9ea55d5-cc97-4446-8add-48e3aecc4ca5',
      title: 'Pass GCSE English',
      createdAt: '2023-01-16T09:34:12.453Z', // English goal was created first and is the oldest
      updatedAt: '2023-04-07T11:17:31.713Z',
    }
    const spanishGoal: GoalResponse = {
      ...aValidGoalResponse(),
      goalReference: '3d566996-2fe0-406c-8b99-66621ff7a7b8',
      title: 'Pass GCSE Spanish',
      createdAt: '2023-01-16T09:37:52.182Z', // Spanish goal was created 2 minutes after the English goal
      updatedAt: '2023-01-16T09:37:52.182Z',
    }

    const getGoalsResponse: GetGoalsResponse = {
      goals: [mathsGoal, spanishGoal, englishGoal], // Goals are returned from the API in createdBy order descending
    }

    // When
    const goals = toGoals(getGoalsResponse)

    // Then
    // Expect goals to be in updatedAt order descending with a sequence number derived from their order of date creation
    expect(goals[0].title).toEqual('Pass GCSE Maths')
    expect(goals[0].sequenceNumber).toEqual(3) // Maths goal is the newest, so we expect it to be goal 3
    expect(goals[1].title).toEqual('Pass GCSE Spanish')
    expect(goals[1].sequenceNumber).toEqual(2) // Spanish goal is in the middle, so we expect it to be goal 2
    expect(goals[2].title).toEqual('Pass GCSE English')
    expect(goals[2].sequenceNumber).toEqual(1) // English goal is the oldest, so we expect it to be goal 1
  })
})
