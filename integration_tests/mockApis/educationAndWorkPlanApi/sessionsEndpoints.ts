import type { SessionResponse } from 'educationAndWorkPlanApiClient'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'
import SessionStatusValue from '../../../server/enums/sessionStatusValue'

const stubGetSessionSummary = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/session/[A-Z]{3}/summary`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        overdueReviews: 1,
        overdueInductions: 2,
        dueReviews: 3,
        dueInductions: 4,
        exemptReviews: 5,
        exemptInductions: 6,
      },
    },
  })

const stubGetSessionSummary404Error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/session/[A-Z]{3}/summary`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: 'Session Summary not found for prison',
        developerMessage: 'Session Summary not found for prison',
        moreInfo: null,
      },
    },
  })

const stubGetSessionSummary500Error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/session/[A-Z]{3}/summary`,
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

const stubGetSessionsForPrisoners = (options: {
  prisonerSessions: Array<SessionResponse>
  status: SessionStatusValue
}): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPathPattern: `/session/summary`,
      queryParameters: {
        status: { equalTo: options.status },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        sessions: options.prisonerSessions,
      },
    },
  })

const stubGetSessionsForPrisoners500Error = (status: SessionStatusValue): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPathPattern: `/session/summary`,
      queryParameters: {
        status: { equalTo: status },
      },
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
  stubGetSessionSummary,
  stubGetSessionSummary404Error,
  stubGetSessionSummary500Error,

  stubGetSessionsForPrisoners,
  stubGetSessionsForPrisoners500Error,
}
