import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import { allPrisons, prisonsKeyedByPrisonId } from '../mockData/prisonRegisterData'
import stubPing from './common'

const stubGetAllPrisons = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prison-register-api/prisons',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: allPrisons,
    },
  })

const getPrisonById = (prisonId = 'MDI'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/prison-register-api/prisons/id/${prisonId}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: prisonsKeyedByPrisonId[prisonId],
      },
    },
  })

const stubPrisonById404Error = (prisonId = 'MDI'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/prison-register-api/prisons/id/${prisonId}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: 'Prison not found exception',
        developerMessage: `Prison ${prisonId} not found`,
        moreInfo: null,
      },
    },
  })

export default {
  stubGetAllPrisons,
  getPrisonById,
  stubPrisonById404Error,
  stubPrisonRegisterApiPing: stubPing('prison-register-api'),
}
