import type { PrisonerSearchSummary } from 'viewModels'
import PagedPrisonerSearchSummary from './pagedPrisonerSearchSummary'

export default class PrisonerListView {
  constructor(
    private readonly pagedPrisonerSearchSummary: PagedPrisonerSearchSummary,
    private readonly searchTerm: string,
    private readonly statusFilter: string,
    private readonly sortBy: string,
    private readonly sortOrder: string,
    private readonly showServiceOnboardingBanner: boolean,
  ) {}

  get renderArgs(): {
    currentPageOfRecords: PrisonerSearchSummary[]
    searchTerm: string
    statusFilter: string
    sortBy: string
    sortOrder: string
    items: Item[]
    results: Results
    previousPage: Paging
    nextPage: Paging
    showServiceOnboardingBanner: boolean
  } {
    return {
      currentPageOfRecords: this.pagedPrisonerSearchSummary.getCurrentPage(),
      searchTerm: this.searchTerm,
      statusFilter: this.statusFilter,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      items: buildItemsArray({
        pagedPrisonerSearchSummary: this.pagedPrisonerSearchSummary,
        searchTerm: this.searchTerm,
        statusFilter: this.statusFilter,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      }),
      results: buildResults(this.pagedPrisonerSearchSummary),
      previousPage: getPreviousPage({
        pagedPrisonerSearchSummary: this.pagedPrisonerSearchSummary,
        searchTerm: this.searchTerm,
        statusFilter: this.statusFilter,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      }),
      nextPage: getNextPage({
        pagedPrisonerSearchSummary: this.pagedPrisonerSearchSummary,
        searchTerm: this.searchTerm,
        statusFilter: this.statusFilter,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      }),
      showServiceOnboardingBanner: this.showServiceOnboardingBanner,
    }
  }
}

const buildItemsArray = (config: {
  pagedPrisonerSearchSummary: PagedPrisonerSearchSummary
  searchTerm: string
  statusFilter: string
  sortBy: string
  sortOrder: string
}): Item[] => {
  const items: Item[] = []

  if (config.pagedPrisonerSearchSummary.totalPages === 1) {
    return items
  }

  for (let page = 1; page <= config.pagedPrisonerSearchSummary.totalPages; page += 1) {
    items.push({
      type: undefined,
      text: page.toString(),
      href: buildQueryString({ ...config, page }),
      selected: page === config.pagedPrisonerSearchSummary.currentPageNumber,
    })
  }
  // Return 10 pages, showing 5 pages before and after the current page
  const start = Math.max(0, config.pagedPrisonerSearchSummary.currentPageNumber - 6)
  const end = Math.min(start + 10, items.length)
  // If are less than 5 pages before the current page, show the previous 10 pages
  if (end - start < 10) {
    return items.slice(Math.max(0, end - 10), end)
  }
  return items.slice(start, end)
}

const buildResults = (pagedPrisonerSearchSummary: PagedPrisonerSearchSummary): Results => ({
  count: pagedPrisonerSearchSummary.totalResults,
  from: pagedPrisonerSearchSummary.resultIndexFrom,
  to: pagedPrisonerSearchSummary.resultIndexTo,
})

const getPreviousPage = (config: {
  pagedPrisonerSearchSummary: PagedPrisonerSearchSummary
  searchTerm: string
  statusFilter: string
  sortBy: string
  sortOrder: string
}): Paging => {
  const page = config.pagedPrisonerSearchSummary.currentPageNumber - 1
  return {
    text: 'Previous',
    href: page >= 1 ? buildQueryString({ ...config, page }) : '',
  }
}

const getNextPage = (config: {
  pagedPrisonerSearchSummary: PagedPrisonerSearchSummary
  searchTerm: string
  statusFilter: string
  sortBy: string
  sortOrder: string
}): Paging => {
  const page = config.pagedPrisonerSearchSummary.currentPageNumber + 1
  return {
    text: 'Next',
    href: page <= config.pagedPrisonerSearchSummary.totalPages ? buildQueryString({ ...config, page }) : '',
  }
}

const buildQueryString = (config: {
  searchTerm: string
  statusFilter: string
  sortBy: string
  sortOrder: string
  page: number
}): string => {
  const queryStringParams = [
    config.searchTerm && `searchTerm=${decodeURIComponent(config.searchTerm)}`,
    config.statusFilter && `statusFilter=${decodeURIComponent(config.statusFilter)}`,
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
