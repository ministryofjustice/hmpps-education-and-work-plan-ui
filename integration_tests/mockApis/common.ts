import { stubFor } from './wiremock'

const stubPing =
  (service?: string) =>
  (status = 200) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `${service ? `/${service}` : ''}/health/ping`,
      },
      response: {
        status,
      },
    })

export default stubPing
