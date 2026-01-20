import type { PersonResponse } from 'educationAndWorkPlanApiClient'
import { SuperAgentRequest } from 'superagent'
import SearchSortField from '../../../server/enums/searchSortField'
import SearchSortDirection from '../../../server/enums/searchSortDirection'
import prisoners from '../../mockData/prisonerByIdData'
import { stubFor } from '../wiremock'
import SearchPlanStatus from '../../../server/enums/searchPlanStatus'

const stubSearchByPrison = (options?: {
  prisonId?: string
  prisonerNameOrNumber?: string
  planStatus?: SearchPlanStatus
  page?: number
  pageSize?: number
  sortBy?: SearchSortField
  sortDirection?: SearchSortDirection
  pageOfPrisoners?: Array<PersonResponse>
  totalRecords?: number
}): SuperAgentRequest => {
  const prisonId = options?.prisonId || 'BXI'
  const page = options?.page || 1
  const pageSize = options?.pageSize || 50
  const sortBy = options?.sortBy || SearchSortField.ENTERED_PRISON_DATE
  const sortDirection = options?.sortDirection || SearchSortDirection.DESC

  const returnedPrisoners: Array<PersonResponse> =
    options?.pageOfPrisoners ||
    Object.values(prisoners)
      .filter(prisoner => prisoner.response.jsonBody.prisonId === prisonId)
      .map(prisoner => prisoner.response.jsonBody)
      .map(prisoner => ({
        prisonNumber: prisoner.prisonerNumber,
        forename: prisoner.firstName,
        surname: prisoner.lastName,
        dateOfBirth: prisoner.dateOfBirth,
        releaseDate: prisoner.releaseDate,
        enteredPrisonOn: prisoner.receptionDate,
        cellLocation: prisoner.cellLocation,
        planStatus: 'ACTIVE_PLAN',
      }))
  const totalElements = options?.totalRecords || returnedPrisoners.length
  const totalPages = Math.ceil(totalElements / pageSize)
  const first = totalPages === 1 || page === 1
  const last = totalPages === 1 || page === totalPages

  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/search/prisons/${prisonId}/people`,
      queryParameters: {
        prisonerNameOrNumber: options?.prisonerNameOrNumber
          ? { equalTo: options?.prisonerNameOrNumber }
          : { absent: true },
        planStatus: options?.planStatus ? { equalTo: options?.planStatus } : { absent: true },
        page: { equalTo: `${page}` },
        pageSize: { equalTo: `${pageSize}` },
        sortBy: { equalTo: `${sortBy}` },
        sortDirection: { equalTo: `${sortDirection}` },
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
        people: returnedPrisoners,
      },
    },
  })
}

const stubSearchByPrison500Error = (options?: {
  prisonId?: string
  prisonerNameOrNumber?: string
  planStatus?: SearchPlanStatus
  page?: number
  pageSize?: number
  sortBy?: SearchSortField
  sortDirection?: SearchSortDirection
}): SuperAgentRequest => {
  const prisonId = options?.prisonId || 'BXI'
  const page = options?.page || 1
  const pageSize = options?.pageSize || 50
  const sortBy = options?.sortBy || SearchSortField.ENTERED_PRISON_DATE
  const sortDirection = options?.sortDirection || SearchSortDirection.DESC

  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/search/prisons/${prisonId}/people`,
      queryParameters: {
        prisonerNameOrNumber: options?.prisonerNameOrNumber
          ? { equalTo: options?.prisonerNameOrNumber }
          : { absent: true },
        planStatus: options?.planStatus ? { equalTo: options?.planStatus } : { absent: true },
        page: { equalTo: `${page}` },
        pageSize: { equalTo: `${pageSize}` },
        sortBy: { equalTo: `${sortBy}` },
        sortDirection: { equalTo: `${sortDirection}` },
      },
    },
    response: {
      status: 500,
      body: 'Unexpected error',
    },
  })
}

export default { stubSearchByPrison, stubSearchByPrison500Error }
