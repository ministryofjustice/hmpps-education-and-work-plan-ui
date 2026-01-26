import type { MojPaginationParams, PrisonerSession, SessionSearch } from 'viewModels'
import type { PaginationMetaData, SessionSearchResponse, SessionSearchResponses } from 'educationAndWorkPlanApiClient'
import { startOfDay } from 'date-fns'
import SortOrder from '../../enums/sortDirection'
import SessionSortBy from '../../enums/sessionSortBy'
import SessionStatusValue from '../../enums/sessionStatusValue'
import SessionTypeValue from '../../enums/sessionTypeValue'

type SearchOptions = {
  sortBy: SessionSortBy
  sortOrder: SortOrder
  searchTerm?: string
  sessionStatusType?: SessionStatusValue
  sessionType?: SessionTypeValue
}

const toSessionSearch = (apiResponse: SessionSearchResponses, searchOptions: SearchOptions): SessionSearch => ({
  sessions: (apiResponse?.sessions || []).map(toPrisonerSession),
  pagination: toMojPaginationParams(searchOptions, apiResponse?.pagination),
})

const toPrisonerSession = (apiResponse: SessionSearchResponse): PrisonerSession => ({
  prisonNumber: apiResponse.prisonNumber,
  firstName: apiResponse.forename,
  lastName: apiResponse.surname,
  releaseDate: apiResponse.releaseDate ? startOfDay(apiResponse.releaseDate) : null,
  location: apiResponse.cellLocation,
  deadlineDate: apiResponse.deadlineDate ? startOfDay(apiResponse.deadlineDate) : null,
  sessionType: apiResponse.sessionType,
  exemption:
    apiResponse.exemptionReason && apiResponse.deadlineDate
      ? {
          exemptionReason: apiResponse.exemptionReason,
          exemptionDate: startOfDay(apiResponse.exemptionDate),
        }
      : undefined,
  reference: null,
})

const toMojPaginationParams = (
  searchOptions: SearchOptions,
  apiResponse: PaginationMetaData = { page: 0, pageSize: 1, totalElements: 0 },
): MojPaginationParams => {
  const from = Math.min(1 + (apiResponse.page - 1) * apiResponse.pageSize, apiResponse.totalElements)
  const to = Math.min(from + apiResponse.pageSize - 1, apiResponse.totalElements)
  return {
    items: buildPageLinks(apiResponse, searchOptions),
    results: {
      count: apiResponse?.totalElements,
      from,
      to,
    },
    previous: {
      text: 'Previous',
      href: apiResponse.page > 1 ? buildQueryString(searchOptions, apiResponse.page - 1) : '',
    },
    next: {
      text: 'Next',
      href: apiResponse.page < apiResponse.totalPages ? buildQueryString(searchOptions, apiResponse.page + 1) : '',
    },
  }
}

const buildPageLinks = (
  apiResponse: PaginationMetaData,
  searchOptions: SearchOptions,
): Array<{ text: string; href: string; selected: boolean }> => {
  const pageLinks =
    apiResponse.totalPages > 1
      ? [...Array(apiResponse.totalPages).fill(0)].map((_, idx) => ({
          text: `${idx + 1}`,
          href: buildQueryString(searchOptions, idx + 1),
          selected: idx + 1 === apiResponse.page,
        }))
      : []
  // Return 10 page links, showing 5 pages before and after the current page
  const start = Math.max(0, apiResponse.page - 6)
  const end = Math.min(start + 10, pageLinks.length)
  // If are less than 5 pages before the current page, show the previous 10 pages
  if (end - start < 10) {
    return pageLinks.slice(Math.max(0, end - 10), end)
  }
  return pageLinks.slice(start, end)
}

const buildQueryString = (searchOptions: SearchOptions, page: number): string => {
  const queryStringParams = [
    searchOptions.searchTerm && `searchTerm=${decodeURIComponent(searchOptions.searchTerm)}`,
    searchOptions.sessionStatusType && `sessionStatusType=${decodeURIComponent(searchOptions.sessionStatusType)}`,
    searchOptions.sessionType && `sessionType=${decodeURIComponent(searchOptions.sessionType)}`,
    `sort=${searchOptions.sortBy},${searchOptions.sortOrder}`,
    `page=${page}`,
  ].filter(val => !!val)
  return `?${queryStringParams.join('&')}`
}

export { toSessionSearch, toPrisonerSession }
