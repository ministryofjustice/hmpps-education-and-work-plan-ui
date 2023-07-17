import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

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

export default { createGoal }
