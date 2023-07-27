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

export default { createGoal, getActionPlan }
