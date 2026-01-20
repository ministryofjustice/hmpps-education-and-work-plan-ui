import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'
import timelinesKeyedByPrisonNumber from '../../mockData/timelineData'

const stubGetTimeline = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/timelines/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: timelinesKeyedByPrisonNumber[prisonNumber],
    },
  })

const stubGetTimeline404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/timelines/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Timeline not found for prisoner ${prisonNumber}`,
        developerMessage: `Timeline not found for prisoner ${prisonNumber}`,
        moreInfo: null,
      },
    },
  })

const stubGetTimeline500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/timelines/${prisonNumber}`,
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
  stubGetTimeline,
  stubGetTimeline404Error,
  stubGetTimeline500Error,
}
