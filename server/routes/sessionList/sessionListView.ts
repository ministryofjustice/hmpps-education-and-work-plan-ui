import type { PrisonerSummaryPrisonerSession, SessionsSummary } from 'viewModels'
import PagedPrisonerSummaryPrisonerSession from './pagedPrisonerSummaryPrisonerSession'
import { SessionListQueryStringParams } from './sessionListQueryStringParams'

export default class SessionListView {
  constructor(
    private readonly sessionsSummary: SessionsSummary,
    private readonly pagedPrisonerSummaryPrisonerSession: PagedPrisonerSummaryPrisonerSession,
    private readonly queryStringParams: SessionListQueryStringParams,
  ) {}

  get renderArgs(): {
    sessionsSummary: SessionsSummary
    currentPageOfRecords: Array<PrisonerSummaryPrisonerSession>
    searchTerm: string
    sessionType: string
    sortBy: string
    sortOrder: string
    items: Item[]
    results: Results
    previousPage: Paging
    nextPage: Paging
  } {
    return {
      sessionsSummary: this.sessionsSummary,
      currentPageOfRecords: this.pagedPrisonerSummaryPrisonerSession.getCurrentPage(),
      searchTerm: this.queryStringParams.searchTerm,
      sessionType: this.queryStringParams.sessionType,
      sortBy: this.queryStringParams.sortOptions.sortBy,
      sortOrder: this.queryStringParams.sortOptions.sortOrder,
      items: buildItemsArray({
        pagedPrisonerSummaryPrisonerSession: this.pagedPrisonerSummaryPrisonerSession,
        searchTerm: this.queryStringParams.searchTerm,
        sessionType: this.queryStringParams.sessionType,
        sortBy: this.queryStringParams.sortOptions.sortBy,
        sortOrder: this.queryStringParams.sortOptions.sortOrder,
      }),
      results: buildResults(this.pagedPrisonerSummaryPrisonerSession),
      previousPage: getPreviousPage({
        pagedPrisonerSummaryPrisonerSession: this.pagedPrisonerSummaryPrisonerSession,
        searchTerm: this.queryStringParams.searchTerm,
        sessionType: this.queryStringParams.sessionType,
        sortBy: this.queryStringParams.sortOptions.sortBy,
        sortOrder: this.queryStringParams.sortOptions.sortOrder,
      }),
      nextPage: getNextPage({
        pagedPrisonerSummaryPrisonerSession: this.pagedPrisonerSummaryPrisonerSession,
        searchTerm: this.queryStringParams.searchTerm,
        sessionType: this.queryStringParams.sessionType,
        sortBy: this.queryStringParams.sortOptions.sortBy,
        sortOrder: this.queryStringParams.sortOptions.sortOrder,
      }),
    }
  }
}

const buildItemsArray = (config: {
  pagedPrisonerSummaryPrisonerSession: PagedPrisonerSummaryPrisonerSession
  searchTerm: string
  sessionType: string
  sortBy: string
  sortOrder: string
}): Item[] => {
  const items: Item[] = []

  if (config.pagedPrisonerSummaryPrisonerSession.totalPages === 1) {
    return items
  }

  for (let page = 1; page <= config.pagedPrisonerSummaryPrisonerSession.totalPages; page += 1) {
    items.push({
      type: undefined,
      text: page.toString(),
      href: buildQueryString({ ...config, page }),
      selected: page === config.pagedPrisonerSummaryPrisonerSession.currentPageNumber,
    })
  }
  // Return 10 pages, showing 5 pages before and after the current page
  const start = Math.max(0, config.pagedPrisonerSummaryPrisonerSession.currentPageNumber - 6)
  const end = Math.min(start + 10, items.length)
  // If are less than 5 pages before the current page, show the previous 10 pages
  if (end - start < 10) {
    return items.slice(Math.max(0, end - 10), end)
  }
  return items.slice(start, end)
}

const buildResults = (pagedPrisonerSummaryPrisonerSession: PagedPrisonerSummaryPrisonerSession): Results => ({
  count: pagedPrisonerSummaryPrisonerSession.totalResults,
  from: pagedPrisonerSummaryPrisonerSession.resultIndexFrom,
  to: pagedPrisonerSummaryPrisonerSession.resultIndexTo,
})

const getPreviousPage = (config: {
  pagedPrisonerSummaryPrisonerSession: PagedPrisonerSummaryPrisonerSession
  searchTerm: string
  sessionType: string
  sortBy: string
  sortOrder: string
}): Paging => {
  const page = config.pagedPrisonerSummaryPrisonerSession.currentPageNumber - 1
  return {
    text: 'Previous',
    href: page >= 1 ? buildQueryString({ ...config, page }) : '',
  }
}

const getNextPage = (config: {
  pagedPrisonerSummaryPrisonerSession: PagedPrisonerSummaryPrisonerSession
  searchTerm: string
  sessionType: string
  sortBy: string
  sortOrder: string
}): Paging => {
  const page = config.pagedPrisonerSummaryPrisonerSession.currentPageNumber + 1
  return {
    text: 'Next',
    href: page <= config.pagedPrisonerSummaryPrisonerSession.totalPages ? buildQueryString({ ...config, page }) : '',
  }
}

const buildQueryString = (config: {
  searchTerm: string
  sessionType: string
  sortBy: string
  sortOrder: string
  page: number
}): string => {
  const queryStringParams = [
    config.searchTerm && `searchTerm=${decodeURIComponent(config.searchTerm)}`,
    config.sessionType && `sessionType=${decodeURIComponent(config.sessionType)}`,
    config.sortBy &&
      config.sortOrder &&
      `sort=${decodeURIComponent(config.sortBy)},${decodeURIComponent(config.sortOrder)}`,
    config.page && `page=${config.page}`,
  ].filter(val => !!val)
  return `?${queryStringParams.join('&')}`
}

interface Item {
  type?: string
  text: string
  href: string
  selected: boolean
}

interface Results {
  count: number
  from: number
  to: number
}

interface Paging {
  text: string
  href: string
}
