import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import prisoners from '../mockData/prisonerByIdData'
import stubPing from './common'

const getPrisonerById = (id = 'G6115VJ'): SuperAgentRequest => stubFor(prisoners[id])

const stubPrisonerById404Error = (prisonNumber = 'A9999ZZ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/prisoner-search-api/prisoner/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        developerMessage: `${prisonNumber} not found`,
      },
    },
  })

export default {
  getPrisonerById,
  stubPrisonerById404Error,
  stubPrisonerSearchApiPing: stubPing('prisoner-search-api'),
}
