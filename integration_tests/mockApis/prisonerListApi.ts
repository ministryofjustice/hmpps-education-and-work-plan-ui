import type { PrisonerSearchSummary } from 'viewModels'
import { format } from 'date-fns'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import prisoners from '../mockData/prisonerByIdData'

const stubPrisonerList = (prisonId = 'BXI', page = 0, pageSize = 9999): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/prisoner-search-api/prisoner-search/prison/${prisonId}`,
      queryParameters: {
        page: { equalTo: `${page}` },
        size: { equalTo: `${pageSize}` },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: Object.values(prisoners)
          .filter(prisoner => prisoner.response.jsonBody.prisonId === prisonId)
          .map(prisoner => prisoner.response.jsonBody),
      },
    },
  })

const stubPrisonerListFromPrisonerSearchSummaries = (
  prisonerSearchSummaries: Array<PrisonerSearchSummary>,
  options?: {
    prisonId?: string
    page?: number
    pageSize?: number
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/prisoner-search-api/prisoner-search/prison/${options?.prisonId || 'BXI'}`,
      queryParameters: {
        page: { equalTo: `${options?.page || 0}` },
        size: { equalTo: `${options?.pageSize || 9999}` },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: prisonerSearchSummaries.map(prisonerSearchSummary => {
          return {
            prisonId: prisonerSearchSummary.prisonId,
            prisonerNumber: prisonerSearchSummary.prisonNumber,
            firstName: prisonerSearchSummary.firstName,
            lastName: prisonerSearchSummary.lastName,
            dateOfBirth: prisonerSearchSummary.dateOfBirth
              ? format(prisonerSearchSummary.dateOfBirth, 'yyyy-MM-dd')
              : undefined,
            receptionDate: prisonerSearchSummary.receptionDate
              ? format(prisonerSearchSummary.receptionDate, 'yyyy-MM-dd')
              : undefined,
            releaseDate: prisonerSearchSummary.releaseDate
              ? format(prisonerSearchSummary.releaseDate, 'yyyy-MM-dd')
              : undefined,
            cellLocation: prisonerSearchSummary.location,
          }
        }),
      },
    },
  })

const stubPrisonerList500error = (prisonId = 'BXI', page = 0, pageSize = 9999): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/prisoner-search-api/prisoner-search/prison/${prisonId}`,
      queryParameters: {
        page: { equalTo: `${page}` },
        size: { equalTo: `${pageSize}` },
      },
    },
    response: {
      status: 500,
      body: 'Unexpected error',
    },
  })

export default {
  stubPrisonerList,
  stubPrisonerList500error,
  stubPrisonerListFromPrisonerSearchSummaries,
}
