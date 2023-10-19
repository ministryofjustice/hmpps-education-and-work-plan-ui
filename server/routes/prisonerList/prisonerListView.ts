import type { PrisonerSearchSummary } from 'viewModels'
import PagedPrisonerSearchSummary from './pagedPrisonerSearchSummary'

export default class PrisonerListView {
  constructor(private readonly pagedPrisonerSearchSummary: PagedPrisonerSearchSummary) {}

  get renderArgs(): {
    currentPageOfRecords: PrisonerSearchSummary[]
  } {
    return {
      currentPageOfRecords: this.pagedPrisonerSearchSummary.getCurrentPage(),
    }
  }
}
