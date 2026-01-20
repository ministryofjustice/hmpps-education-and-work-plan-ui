import type { PrisonerSearchSummary } from 'viewModels'
import { format } from 'date-fns'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

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

export default {
  stubPrisonerListFromPrisonerSearchSummaries,
}
