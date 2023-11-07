import type { PrisonerSearchSummary } from 'viewModels'
import PagedPrisonerSearchSummary from './pagedPrisonerSearchSummary'

export default class PrisonerListView {
  constructor(
    private readonly pagedPrisonerSearchSummary: PagedPrisonerSearchSummary,
    private readonly searchTerm: string,
    private readonly statusFilter: string,
    private readonly sortBy: string,
    private readonly sortOrder: string,
  ) {}

  get renderArgs(): {
    currentPageOfRecords: PrisonerSearchSummary[]
    searchTerm: string
    statusFilter: string
    sortBy: string
    sortOrder: string
    renderPaginationControls: boolean
    items: Item[]
    results: Results
    previousPage: Paging
    nextPage: Paging
  } {
    return {
      currentPageOfRecords: this.pagedPrisonerSearchSummary.getCurrentPage(),
      searchTerm: this.searchTerm,
      statusFilter: this.statusFilter,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      renderPaginationControls: this.pagedPrisonerSearchSummary.totalPages > 1,
      items: buildItemsArray({
        pagedPrisonerSearchSummary: this.pagedPrisonerSearchSummary,
        searchTerm: this.searchTerm,
        statusFilter: this.statusFilter,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      }),
      results: buildResults(this.pagedPrisonerSearchSummary),
      previousPage: getPreviousPage(this.pagedPrisonerSearchSummary),
      nextPage: getNextPage(this.pagedPrisonerSearchSummary),
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
  for (let page = 1; page <= config.pagedPrisonerSearchSummary.totalPages; page += 1) {
    const queryStringParams = [
      config.searchTerm && `searchTerm=${decodeURIComponent(config.searchTerm)}`,
      config.statusFilter && `statusFilter=${decodeURIComponent(config.statusFilter)}`,
      config.sortBy &&
        config.sortOrder &&
        `sort=${decodeURIComponent(config.sortBy)},${decodeURIComponent(config.sortOrder)}`,
      page && `page=${page}`,
    ].filter(val => !!val)
    items.push({
      type: undefined,
      text: page.toString(),
      href: `?${queryStringParams.join('&')}`,
      selected: page === config.pagedPrisonerSearchSummary.currentPageNumber,
    })
  }
  return items
}

const buildResults = (pagedPrisonerSearchSummary: PagedPrisonerSearchSummary): Results => ({
  count: pagedPrisonerSearchSummary.totalResults,
  from: pagedPrisonerSearchSummary.resultIndexFrom,
  to: pagedPrisonerSearchSummary.resultIndexTo,
})

const getPreviousPage = (pagedPrisonerSearchSummary: PagedPrisonerSearchSummary): Paging => {
  const previousPageNumber = pagedPrisonerSearchSummary.currentPageNumber - 1
  return {
    text: 'Previous',
    href: previousPageNumber > 1 ? `?page=${previousPageNumber}` : '',
  }
}

const getNextPage = (pagedPrisonerSearchSummary: PagedPrisonerSearchSummary): Paging => {
  const nextPageNumber = pagedPrisonerSearchSummary.currentPageNumber + 1
  return {
    text: 'Next',
    href: nextPageNumber <= pagedPrisonerSearchSummary.totalPages ? `?page=${nextPageNumber}` : '',
  }
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
