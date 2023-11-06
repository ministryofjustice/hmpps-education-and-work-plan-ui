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
      items: buildItemsArray(this.pagedPrisonerSearchSummary),
      results: buildResults(this.pagedPrisonerSearchSummary),
      previousPage: getPreviousPage(this.pagedPrisonerSearchSummary),
      nextPage: getNextPage(this.pagedPrisonerSearchSummary),
    }
  }
}

const buildItemsArray = (pagedPrisonerSearchSummary: PagedPrisonerSearchSummary): Item[] => {
  const items: Item[] = []
  for (let i = 1; i <= pagedPrisonerSearchSummary.totalPages; i += 1) {
    items.push({
      type: undefined,
      text: i.toString(),
      href: `?page=${i}`,
      selected: i === pagedPrisonerSearchSummary.currentPageNumber,
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
