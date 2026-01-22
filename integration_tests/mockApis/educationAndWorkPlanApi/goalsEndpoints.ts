import type { GoalResponse } from 'educationAndWorkPlanApiClient'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'
import actionPlans from '../../mockData/actionPlanByPrisonNumberData'
import GoalStatusValue from '../../../server/enums/goalStatusValue'
import { aValidGoalResponse } from '../../../server/testsupport/actionPlanResponseTestDataBuilder'

const createGoals = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans/.*/goals',
    },
    response: {
      status: 201,
    },
  })

const getGoalsByStatus = (
  conf: { prisonNumber: string; status?: GoalStatusValue; goals?: [] } = {
    prisonNumber: 'G6115VJ',
    status: GoalStatusValue.ACTIVE,
    goals: undefined,
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${conf.prisonNumber}/goals\\?status=${conf.status}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        goals: conf.goals || actionPlans[conf.prisonNumber].response.jsonBody.goals,
      },
    },
  })

const getGoalsByStatus500 = (
  conf: { prisonNumber: string; status?: GoalStatusValue } = {
    prisonNumber: 'G6115VJ',
    status: GoalStatusValue.ACTIVE,
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${conf.prisonNumber}/goals\\?status=${conf.status}`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })

const getGoalsByStatus404 = (
  conf: { prisonNumber: string; status?: GoalStatusValue } = {
    prisonNumber: 'G6115VJ',
    status: GoalStatusValue.ACTIVE,
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${conf.prisonNumber}/goals\\?status=${conf.status}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: 'No goals added yet',
        developerMessage: 'No goals added yet',
        moreInfo: null,
      },
    },
  })

const getGoal = (options?: { prisonNumber?: string; goalReference?: string; goal?: GoalResponse }): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${options?.prisonNumber || 'G6115VJ'}/goals/${options?.goalReference || '10efc562-be8f-4675-9283-9ede0c19dade'}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options?.goal ||
        aValidGoalResponse({ goalReference: options?.goalReference || '10efc562-be8f-4675-9283-9ede0c19dade' }),
    },
  })

const getGoal500Error = (options?: {
  prisonNumber?: string
  goalReference?: string
  goal?: GoalResponse
}): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${options?.prisonNumber || 'G6115VJ'}/goals/${options?.goalReference || '10efc562-be8f-4675-9283-9ede0c19dade'}`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })

const getGoal404Error = (options?: {
  prisonNumber?: string
  goalReference?: string
  goal?: GoalResponse
}): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${options?.prisonNumber || 'G6115VJ'}/goals/${options?.goalReference || '10efc562-be8f-4675-9283-9ede0c19dade'}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: 'No goals added yet',
        developerMessage: 'No goals added yet',
        moreInfo: null,
      },
    },
  })

const updateGoal = (
  prisonNumber = 'G6115VJ',
  goalReference = '10efc562-be8f-4675-9283-9ede0c19dade',
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${prisonNumber}/goals/${goalReference}`,
    },
    response: {
      status: 204,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const updateGoal500Error = (
  prisonNumber = 'G6115VJ',
  goalReference = '10efc562-be8f-4675-9283-9ede0c19dade',
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${prisonNumber}/goals/${goalReference}`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })

const archiveGoal = (
  options: {
    prisonNumber: string
    goalReference: string
  } = {
    prisonNumber: 'G6115VJ',
    goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${options.prisonNumber}/goals/${options.goalReference}/archive`,
    },
    response: {
      status: 204,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const unarchiveGoal = (
  prisonNumber = 'G6115VJ',
  goalReference = '10efc562-be8f-4675-9283-9ede0c19dade',
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${prisonNumber}/goals/${goalReference}/unarchive`,
    },
    response: {
      status: 204,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const completeGoal = (
  options: {
    prisonNumber: string
    goalReference: string
  } = {
    prisonNumber: 'G6115VJ',
    goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${options.prisonNumber}/goals/${options.goalReference}/complete`,
    },
    response: {
      status: 204,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

export default {
  createGoals,

  getGoalsByStatus,
  getGoalsByStatus404,
  getGoalsByStatus500,

  getGoal,
  getGoal404Error,
  getGoal500Error,

  updateGoal,
  updateGoal500Error,
  archiveGoal,
  completeGoal,
  unarchiveGoal,
}
