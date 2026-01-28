import type { SessionSearchResponse } from 'educationAndWorkPlanApiClient'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'
import SessionStatusValue from '../../../server/enums/sessionStatusValue'
import SearchSortDirection from '../../../server/enums/searchSortDirection'
import prisoners from '../../mockData/prisonerByIdData'
import SessionSearchSortField from '../../../server/enums/sessionSearchSortField'
import SessionTypeValue from '../../../server/enums/sessionTypeValue'

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

const stubSearchSessionsByPrison = (options?: {
  prisonId?: string
  prisonerNameOrNumber?: string
  sessionType: SessionTypeValue
  sessionStatusType?: SessionStatusValue
  page?: number
  pageSize?: number
  sortBy?: SessionSearchSortField
  sortDirection?: SearchSortDirection
  pageOfSessions?: Array<SessionSearchResponse>
  totalRecords?: number
}): SuperAgentRequest => {
  const prisonId = options?.prisonId || 'BXI'
  const page = options?.page || 1
  const pageSize = options?.pageSize || 50
  const sortBy = options?.sortBy || SessionSearchSortField.DUE_BY
  const sortDirection = options?.sortDirection || SearchSortDirection.ASC

  const returnedSessions: Array<SessionSearchResponse> =
    options?.pageOfSessions ||
    Object.values(prisoners)
      .filter(prisoner => prisoner.response.jsonBody.prisonId === prisonId)
      .map(prisoner => prisoner.response.jsonBody)
      .map(prisoner => ({
        prisonNumber: prisoner.prisonerNumber,
        forename: prisoner.firstName,
        surname: prisoner.lastName,
        dateOfBirth: prisoner.dateOfBirth,
        releaseDate: prisoner.releaseDate,
        cellLocation: prisoner.cellLocation,
        deadlineDate: '2026-01-10',
        exemptionDate: '2025-12-20',
        exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
        sessionType: options?.sessionType || SessionTypeValue.REVIEW,
      }))
  const totalElements = options?.totalRecords || returnedSessions.length
  const totalPages = Math.ceil(totalElements / pageSize)
  const first = totalPages === 1 || page === 1
  const last = totalPages === 1 || page === totalPages

  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/session/prisons/${prisonId}/search`,
      queryParameters: {
        prisonerNameOrNumber: options?.prisonerNameOrNumber
          ? { equalTo: options?.prisonerNameOrNumber }
          : { absent: true },
        sessionType: options?.sessionType ? { equalTo: options?.sessionType } : { absent: true },
        sessionStatusType: { equalTo: options?.sessionStatusType || SessionStatusValue.DUE },
        page: { equalTo: `${page}` },
        pageSize: { equalTo: `${pageSize}` },
        sortBy: { equalTo: sortBy },
        sortDirection: { equalTo: sortDirection },
      },
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        pagination: {
          totalElements,
          totalPages,
          page,
          last,
          first,
          pageSize,
        },
        sessions: returnedSessions,
      },
    },
  })
}

const stubSearchSessionsByPrison500Error = (options?: {
  prisonId?: string
  prisonerNameOrNumber?: string
  sessionType: SessionTypeValue
  sessionStatusType?: SessionStatusValue
  page?: number
  pageSize?: number
  sortBy?: SessionSearchSortField
  sortDirection?: SearchSortDirection
}): SuperAgentRequest => {
  const prisonId = options?.prisonId || 'BXI'
  const page = options?.page || 1
  const pageSize = options?.pageSize || 50
  const sortBy = options?.sortBy || SessionSearchSortField.DUE_BY
  const sortDirection = options?.sortDirection || SearchSortDirection.ASC

  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/session/prisons/${prisonId}/search`,
      queryParameters: {
        prisonerNameOrNumber: options?.prisonerNameOrNumber
          ? { equalTo: options?.prisonerNameOrNumber }
          : { absent: true },
        sessionType: options?.sessionType ? { equalTo: options?.sessionType } : { absent: true },
        sessionStatusType: { equalTo: options?.sessionStatusType || SessionStatusValue.DUE },
        page: { equalTo: `${page}` },
        pageSize: { equalTo: `${pageSize}` },
        sortBy: { equalTo: sortBy },
        sortDirection: { equalTo: sortDirection },
      },
    },
    response: {
      status: 500,
      body: 'Unexpected error',
    },
  })
}

export default {
  stubGetSessionSummary,
  stubGetSessionSummary404Error,
  stubGetSessionSummary500Error,

  stubSearchSessionsByPrison,
  stubSearchSessionsByPrison500Error,
}
