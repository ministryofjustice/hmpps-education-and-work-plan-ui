import { stubFor } from './wiremock'

const createGoal = () =>
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
