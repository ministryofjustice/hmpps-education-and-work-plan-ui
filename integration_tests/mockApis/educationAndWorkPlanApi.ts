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

  getActionPlanForPrisonerWithNoGoals,
  getActionPlan500Error,
}
