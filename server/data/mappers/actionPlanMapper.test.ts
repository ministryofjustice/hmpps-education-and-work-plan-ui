import type { ActionPlanResponse, GetGoalsResponse, GoalResponse } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goal, Step } from 'viewModels'
import { toDate } from 'date-fns'
import { toActionPlan, toGoals } from './actionPlanMapper'
import {
  aValidActionPlanResponseWithOneGoal,
  aValidGoalResponse,
} from '../../testsupport/actionPlanResponseTestDataBuilder'

describe('actionPlanMapper', () => {
  const examplePrisonNamesById = new Map([
    ['BXI', 'Brixton (HMP)'],
    ['MDI', 'Moorland (HMP & YOI)'],
  ])

  describe('toActionPlan', () => {
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
        createdAtPrisonName: 'Brixton (HMP)',
        updatedBy: 'asmith_gen',
        updatedByDisplayName: 'Alex Smith',
        updatedAt: new Date('2023-09-23T13:42:01.401Z'),
        updatedAtPrisonName: 'Brixton (HMP)',
        notesByType: {
          GOAL: [
            {
              reference: '8092b80e-4d60-418f-983a-da457ff8df40',
              content: 'Prisoner is not good at listening',
              type: 'GOAL',
              createdBy: 'asmith_gen',
              createdByDisplayName: 'Alex Smith',
              createdAt: new Date('2023-01-16T09:34:12.453Z'),
              createdAtPrisonName: 'Brixton (HMP)',
              updatedBy: 'asmith_gen',
              updatedByDisplayName: 'Alex Smith',
              updatedAt: new Date('2023-09-23T13:42:01.401Z'),
              updatedAtPrisonName: 'Brixton (HMP)',
            },
          ],
          GOAL_ARCHIVAL: [],
          GOAL_COMPLETION: [],
        },
      }
      const expectedActionPlan: ActionPlan = {
        prisonNumber: actionPlanResponse.prisonNumber,
        goals: [expectedGoal],
        problemRetrievingData: false,
      }

      // When
      const actionPlan = toActionPlan(actionPlanResponse, problemRetrievingData, examplePrisonNamesById)

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
        createdAt: '2023-02-03T15:16:51.516Z',
        updatedAt: '2023-09-23T13:42:01.401Z',
      }
      const englishGoal: GoalResponse = {
        ...aValidGoalResponse(),
        goalReference: 'e9ea55d5-cc97-4446-8add-48e3aecc4ca5',
        title: 'Pass GCSE English',
        createdAt: '2023-01-16T09:34:12.453Z',
        updatedAt: '2023-04-07T11:17:31.713Z',
      }
      const spanishGoal: GoalResponse = {
        ...aValidGoalResponse(),
        goalReference: '3d566996-2fe0-406c-8b99-66621ff7a7b8',
        title: 'Pass GCSE Spanish',
        createdAt: '2023-01-16T09:37:52.182Z',
        updatedAt: '2023-01-16T09:37:52.182Z',
      }

      const actionPlanResponse: ActionPlanResponse = {
        prisonNumber: 'A1234BC',
        goals: [mathsGoal, spanishGoal, englishGoal],
      }

      // When
      const actionPlan = toActionPlan(actionPlanResponse, problemRetrievingData, examplePrisonNamesById)

      // Then
      expect(actionPlan.goals[0].title).toEqual('Pass GCSE Maths')
      expect(actionPlan.goals[1].title).toEqual('Pass GCSE Spanish')
      expect(actionPlan.goals[2].title).toEqual('Pass GCSE English')
    })
  })

  describe('toGoals', () => {
    it('should map to goals given valid GoalsResponse containing several goals', () => {
      // Given
      const mathsGoal: GoalResponse = {
        ...aValidGoalResponse(),
        goalReference: 'd81c94d1-6818-4093-9e3b-196e138aa4c9',
        title: 'Pass GCSE Maths',
        createdAt: '2023-02-03T15:16:51.516Z',
        updatedAt: '2023-09-23T13:42:01.401Z',
      }
      const englishGoal: GoalResponse = {
        ...aValidGoalResponse(),
        goalReference: 'e9ea55d5-cc97-4446-8add-48e3aecc4ca5',
        title: 'Pass GCSE English',
        createdAt: '2023-01-16T09:34:12.453Z',
        updatedAt: '2023-04-07T11:17:31.713Z',
      }
      const spanishGoal: GoalResponse = {
        ...aValidGoalResponse(),
        goalReference: '3d566996-2fe0-406c-8b99-66621ff7a7b8',
        title: 'Pass GCSE Spanish',
        createdAt: '2023-01-16T09:37:52.182Z',
        updatedAt: '2023-01-16T09:37:52.182Z',
      }

      const getGoalsResponse: GetGoalsResponse = {
        goals: [mathsGoal, englishGoal, spanishGoal],
      }

      // When
      const goals = toGoals(getGoalsResponse, examplePrisonNamesById)

      // Then
      expect(goals[0].title).toEqual('Pass GCSE Maths')
      expect(goals[1].title).toEqual('Pass GCSE English')
      expect(goals[2].title).toEqual('Pass GCSE Spanish')
    })

    it('should map optional fields given valid GoalsResponse', () => {
      // Given
      const aGoal: GoalResponse = {
        goalReference: 'd38a6c41-13d1-1d05-13c2-24619966119b',
        title: 'Learn Spanish',
        status: 'ARCHIVED',
        steps: [
          {
            stepReference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            title: 'Book Spanish course',
            status: 'ACTIVE',
            sequenceNumber: 1,
          },
        ],
        createdBy: 'asmith_gen',
        createdByDisplayName: 'Alex Smith',
        createdAtPrison: 'BXI',
        createdAt: '2023-01-16T09:34:12.453Z',
        updatedBy: 'asmith_gen',
        updatedByDisplayName: 'Alex Smith',
        updatedAtPrison: 'MDI',
        updatedAt: '2023-09-23T13:42:01.401Z',
        targetCompletionDate: '2024-02-29T00:00:00.000Z',
        notes: 'Prisoner is not good at listening',
        goalNotes: [
          {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Prisoner is not good at listening',
            type: 'GOAL',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-01-16T09:34:12.453Z',
            createdAtPrison: 'BXI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-09-23T13:42:01.401Z',
            updatedAtPrison: 'BXI',
          },
        ],
        archiveReason: 'OTHER',
        archiveReasonOther: 'Some other reason',
      }

      const expectedGoal: Goal = {
        goalReference: 'd38a6c41-13d1-1d05-13c2-24619966119b',
        title: 'Learn Spanish',
        status: 'ARCHIVED',
        steps: [
          {
            stepReference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            title: 'Book Spanish course',
            status: 'ACTIVE',
            sequenceNumber: 1,
          },
        ],
        createdBy: 'asmith_gen',
        createdByDisplayName: 'Alex Smith',
        createdAt: toDate('2023-01-16T09:34:12.453Z'),
        createdAtPrisonName: 'Brixton (HMP)',
        updatedBy: 'asmith_gen',
        updatedByDisplayName: 'Alex Smith',
        updatedAtPrisonName: 'Moorland (HMP & YOI)',
        updatedAt: toDate('2023-09-23T13:42:01.401Z'),
        targetCompletionDate: toDate('2024-02-29T00:00:00.000Z'),
        notesByType: {
          GOAL: [
            {
              reference: '8092b80e-4d60-418f-983a-da457ff8df40',
              content: 'Prisoner is not good at listening',
              type: 'GOAL',
              createdBy: 'asmith_gen',
              createdByDisplayName: 'Alex Smith',
              createdAt: toDate('2023-01-16T09:34:12.453Z'),
              createdAtPrisonName: 'Brixton (HMP)',
              updatedBy: 'asmith_gen',
              updatedByDisplayName: 'Alex Smith',
              updatedAt: toDate('2023-09-23T13:42:01.401Z'),
              updatedAtPrisonName: 'Brixton (HMP)',
            },
          ],
          GOAL_ARCHIVAL: [],
          GOAL_COMPLETION: [],
        },
        archiveReason: 'OTHER',
        archiveReasonOther: 'Some other reason',
      }

      const getGoalsResponse: GetGoalsResponse = {
        goals: [aGoal],
      }

      // When
      const goals = toGoals(getGoalsResponse, examplePrisonNamesById)

      // Then
      expect(goals[0]).toEqual(expectedGoal)
    })

    it('should map prison name to id if not in prison names', () => {
      // Given
      const aGoal: GoalResponse = {
        ...aValidGoalResponse(),
        updatedAtPrison: 'XXX',
      }

      const getGoalsResponse: GetGoalsResponse = {
        goals: [aGoal],
      }

      // When
      const goals = toGoals(getGoalsResponse, examplePrisonNamesById)

      // Then
      expect(goals[0].updatedAtPrisonName).toEqual('XXX')
    })

    it('should map prison id to id if not in prison names', () => {
      // Given
      const aGoal: GoalResponse = {
        ...aValidGoalResponse(),
        updatedAtPrison: undefined,
      }

      const getGoalsResponse: GetGoalsResponse = {
        goals: [aGoal],
      }

      // When
      const goals = toGoals(getGoalsResponse, examplePrisonNamesById)

      // Then
      expect(goals[0].updatedAtPrisonName).toEqual(undefined)
    })

    it('should map goals with combinations of notes', () => {
      // Given
      const aGoalWithNoNotes = {
        ...aValidGoalResponse({ title: 'Goal with no notes', status: 'ACTIVE' }),
        notes: undefined,
        goalNotes: [],
      }
      const aGoalWithNotes = {
        ...aValidGoalResponse({ title: 'Goal with notes', status: 'ACTIVE' }),
        notes: 'Prisoner is not good at listening',
        goalNotes: [
          {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Prisoner is not good at listening',
            type: 'GOAL',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-01-16T09:34:12.453Z',
            createdAtPrison: 'BXI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-09-23T13:42:01.401Z',
            updatedAtPrison: 'BXI',
          },
        ],
      }
      const anArchivedGoal = {
        ...aValidGoalResponse({ title: 'An archived goal', status: 'ARCHIVED' }),
        notes: undefined,
        goalNotes: [
          {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Prisoner has decided not to carry on with this goal',
            type: 'GOAL_ARCHIVAL',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-01-16T09:34:12.453Z',
            createdAtPrison: 'BXI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-09-23T13:42:01.401Z',
            updatedAtPrison: 'BXI',
          },
        ],
      }
      const aCompletedGoal = {
        ...aValidGoalResponse({ title: 'A completed goal', status: 'COMPLETED' }),
        notes: undefined,
        goalNotes: [
          {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Prisoner has completed this goal',
            type: 'GOAL_COMPLETION',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-01-16T09:34:12.453Z',
            createdAtPrison: 'BXI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-09-23T13:42:01.401Z',
            updatedAtPrison: 'BXI',
          },
        ],
      }
      const aCompletedGoalWithGoalNotes = {
        ...aValidGoalResponse({ title: 'A completed goal with goal notes', status: 'COMPLETED' }),
        notes: 'Prisoner is not good at listening',
        goalNotes: [
          {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Prisoner is not good at listening',
            type: 'GOAL',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-01-16T09:34:12.453Z',
            createdAtPrison: 'BXI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-09-23T13:42:01.401Z',
            updatedAtPrison: 'BXI',
          },
          {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Prisoner has completed this goal',
            type: 'GOAL_COMPLETION',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-01-16T09:34:12.453Z',
            createdAtPrison: 'BXI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-09-23T13:42:01.401Z',
            updatedAtPrison: 'BXI',
          },
        ],
      }

      const getGoalsResponse = {
        goals: [aGoalWithNoNotes, aGoalWithNotes, anArchivedGoal, aCompletedGoal, aCompletedGoalWithGoalNotes],
      }

      // When
      const goals = toGoals(getGoalsResponse, examplePrisonNamesById)

      // Then
      expect(goals[0].notesByType).toEqual({
        GOAL: [],
        GOAL_ARCHIVAL: [],
        GOAL_COMPLETION: [],
      })
      expect(goals[1].notesByType).toEqual({
        GOAL: [
          {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Prisoner is not good at listening',
            type: 'GOAL',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: new Date('2023-01-16T09:34:12.453Z'),
            createdAtPrisonName: 'Brixton (HMP)',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: new Date('2023-09-23T13:42:01.401Z'),
            updatedAtPrisonName: 'Brixton (HMP)',
          },
        ],
        GOAL_ARCHIVAL: [],
        GOAL_COMPLETION: [],
      })
      expect(goals[2].notesByType).toEqual({
        GOAL: [],
        GOAL_ARCHIVAL: [
          {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Prisoner has decided not to carry on with this goal',
            type: 'GOAL_ARCHIVAL',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: new Date('2023-01-16T09:34:12.453Z'),
            createdAtPrisonName: 'Brixton (HMP)',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: new Date('2023-09-23T13:42:01.401Z'),
            updatedAtPrisonName: 'Brixton (HMP)',
          },
        ],
        GOAL_COMPLETION: [],
      })
      expect(goals[3].notesByType).toEqual({
        GOAL: [],
        GOAL_ARCHIVAL: [],
        GOAL_COMPLETION: [
          {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Prisoner has completed this goal',
            type: 'GOAL_COMPLETION',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: new Date('2023-01-16T09:34:12.453Z'),
            createdAtPrisonName: 'Brixton (HMP)',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: new Date('2023-09-23T13:42:01.401Z'),
            updatedAtPrisonName: 'Brixton (HMP)',
          },
        ],
      })
      expect(goals[4].notesByType).toEqual({
        GOAL: [
          {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Prisoner is not good at listening',
            type: 'GOAL',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: new Date('2023-01-16T09:34:12.453Z'),
            createdAtPrisonName: 'Brixton (HMP)',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: new Date('2023-09-23T13:42:01.401Z'),
            updatedAtPrisonName: 'Brixton (HMP)',
          },
        ],
        GOAL_ARCHIVAL: [],
        GOAL_COMPLETION: [
          {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Prisoner has completed this goal',
            type: 'GOAL_COMPLETION',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: new Date('2023-01-16T09:34:12.453Z'),
            createdAtPrisonName: 'Brixton (HMP)',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: new Date('2023-09-23T13:42:01.401Z'),
            updatedAtPrisonName: 'Brixton (HMP)',
          },
        ],
      })
    })
  })
})
