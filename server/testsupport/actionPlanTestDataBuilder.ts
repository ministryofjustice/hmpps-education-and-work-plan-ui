import type { Step, Goal, ActionPlan } from 'viewModels'

const aValidActionPlan = (options?: {
  prisonNumber?: string
  goals?: Array<Goal>
  problemRetrievingData?: boolean
}): ActionPlan => {
  return {
    prisonNumber: options?.prisonNumber || 'A1234BC',
    goals: options?.goals || [aValidGoal()],
    problemRetrievingData:
      !options || options.problemRetrievingData === null || options.problemRetrievingData === undefined
        ? false
        : options.problemRetrievingData,
  }
}

const aValidActionPlanWithOneGoal = (options?: {
  prisonNumber?: string
  goal?: Goal
  problemRetrievingData?: boolean
}): ActionPlan => {
  return aValidActionPlan({
    prisonNumber: options?.prisonNumber || 'A1234BC',
    goals: [options?.goal || aValidGoal()],
    problemRetrievingData:
      !options || options.problemRetrievingData === null || options.problemRetrievingData === undefined
        ? false
        : options.problemRetrievingData,
  })
}

const aValidGoal = (options?: {
  title?: string
  goalReference?: string
  steps?: Array<Step>
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  createdAtPrisonName?: string
  updatedAtPrisonName?: string
}): Goal => {
  return {
    goalReference: options?.goalReference || 'd38a6c41-13d1-1d05-13c2-24619966119b',
    title: options?.title || 'Learn Spanish',
    status: options?.status || 'ACTIVE',
    steps: options?.steps || [aValidStep(), anotherValidStep()],
    createdBy: 'asmith_gen',
    createdByDisplayName: 'Alex Smith',
    createdAt: new Date('2023-01-16T09:34:12.453Z'),
    createdAtPrisonName: options?.createdAtPrisonName || 'Brixton (HMP)',
    updatedBy: 'asmith_gen',
    updatedByDisplayName: 'Alex Smith',
    updatedAt: new Date('2023-09-23T13:42:01.401Z'),
    updatedAtPrisonName: options?.updatedAtPrisonName || 'Brixton (HMP)',
    targetCompletionDate: new Date('2024-02-29T00:00:00.000Z'),
    notesByType: {
      GOAL: [
        {
          content: 'Prisoner is not good at listening',
          createdAt: new Date('2023-01-16T09:34:12.453Z'),
          createdAtPrisonName: options?.createdAtPrisonName || 'Brixton (HMP)',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          reference: '8092b80e-4d60-418f-983a-da457ff8df40',
          type: 'GOAL',
          updatedAt: new Date('2023-09-23T13:42:01.401Z'),
          updatedAtPrisonName: options?.updatedAtPrisonName || 'Brixton (HMP)',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
        },
      ],
      GOAL_ARCHIVAL: [],
      GOAL_COMPLETION: [],
    },
  }
}

const aValidGoalWithUpdatedAtData = (options?: {
  title?: string
  goalReference?: string
  steps?: Array<Step>
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  updatedByDisplayName?: string
  updatedAt?: Date
  createdAtPrisonName?: string
  updatedAtPrisonName?: string
}): Goal => {
  return {
    goalReference: options?.goalReference || 'd38a6c41-13d1-1d05-13c2-24619966119b',
    title: options?.title || 'Learn Spanish',
    status: options?.status || 'ACTIVE',
    steps: options?.steps || [aValidStep(), anotherValidStep()],
    createdBy: 'asmith_gen',
    createdByDisplayName: 'Alex Smith',
    createdAt: new Date('2023-01-16T09:34:12.453Z'),
    createdAtPrisonName: options?.updatedAtPrisonName || 'Brixton (HMP)',
    updatedBy: 'asmith_gen',
    updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
    updatedAtPrisonName: options?.updatedAtPrisonName || 'Moorland (HMP & YOI)',
    updatedAt: options?.updatedAt || new Date('2023-09-23T13:42:01.401Z'),
    targetCompletionDate: new Date('2024-02-29T00:00:00.000Z'),
    notesByType: {
      GOAL: [
        {
          content: 'Prisoner is not good at listening',
          createdAt: new Date('2023-01-16T09:34:12.453Z'),
          createdAtPrisonName: options?.createdAtPrisonName || 'Brixton (HMP)',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          reference: '8092b80e-4d60-418f-983a-da457ff8df40',
          type: 'GOAL',
          updatedAt: new Date('2023-09-23T13:42:01.401Z'),
          updatedAtPrisonName: options?.updatedAtPrisonName || 'Moorland (HMP & YOI)',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
        },
      ],
      GOAL_ARCHIVAL: [],
      GOAL_COMPLETION: [],
    },
  }
}

const aValidStep = (): Step => {
  return {
    stepReference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
    title: 'Book Spanish course',
    status: 'ACTIVE',
    sequenceNumber: 1,
  }
}

const anotherValidStep = (): Step => {
  return {
    stepReference: 'dc817ce8-2b2e-4282-96b2-b9a1d831fc56',
    title: 'Complete Spanish course',
    status: 'NOT_STARTED',
    sequenceNumber: 2,
  }
}

export {
  aValidActionPlan,
  aValidActionPlanWithOneGoal,
  aValidGoal,
  aValidGoalWithUpdatedAtData,
  aValidStep,
  anotherValidStep,
}
