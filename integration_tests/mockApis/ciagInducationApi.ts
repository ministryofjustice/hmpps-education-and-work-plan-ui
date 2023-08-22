import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const stubGetCiagProfile404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/ciag/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `CIAG profile does not exist for offender ${prisonNumber}`,
        developerMessage: `CIAG profile does not exist for offender ${prisonNumber}`,
        moreInfo: null,
      },
    },
  })

const stubGetCiagProfile500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/ciag/${prisonNumber}`,
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

export default { stubGetCiagProfile404Error, stubGetCiagProfile500Error }
