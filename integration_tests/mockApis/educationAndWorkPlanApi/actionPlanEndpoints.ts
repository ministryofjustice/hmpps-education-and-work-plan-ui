import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'
import actionPlans from '../../mockData/actionPlanByPrisonNumberData'

const createActionPlan = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans/.*',
    },
    response: {
      status: 201,
    },
  })

const getActionPlan = (prisonNumber = 'G6115VJ'): SuperAgentRequest => stubFor(actionPlans[prisonNumber])

const getActionPlan404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Unable to find ActionPlan for prisoner [${prisonNumber}]`,
        developerMessage: `Unable to find ActionPlan for prisoner [${prisonNumber}]`,
        moreInfo: null,
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
  createActionPlan,
  getActionPlan,
  getActionPlan404Error,
  getActionPlan500Error,
}
