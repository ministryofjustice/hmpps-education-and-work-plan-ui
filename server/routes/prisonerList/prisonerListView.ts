import type { PrisonerSearchSummary } from 'viewModels'
import PagedPrisonerSearchSummary from './pagedPrisonerSearchSummary'

export default class PrisonerListView {
  constructor(
    private readonly pagedPrisonerSearchSummary: PagedPrisonerSearchSummary,
    private readonly searchTerm?: string,
    private readonly statusFilter?: string,
  ) {}

  get renderArgs(): {
    currentPageOfRecords: PrisonerSearchSummary[]
    searchTerm?: string
    statusFilter?: string
  } {
    return {
      currentPageOfRecords: this.pagedPrisonerSearchSummary.getCurrentPage(),
      searchTerm: this.searchTerm,
      statusFilter: this.statusFilter,
    }
  }
}
