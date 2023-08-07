import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import actionPlans from '../mockData/actionPlanByPrisonNumberData'

const createGoal = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans/.*/goals',
    },
    response: {
      status: 201,
    },
  })

const getActionPlan = (id = 'G6115VJ'): SuperAgentRequest => stubFor(actionPlans[id])

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

const getActionPlanForPrisonerWithNoGoals = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: `${prisonNumber}`,
        goals: [],
      },
    },
  })

const getActionPlan500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}`,
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

export default {
  createGoal,
  getActionPlan,
  updateGoal,

  getActionPlanForPrisonerWithNoGoals,
  getActionPlan500Error,
}
