import { SortBy, SortOrder } from './pagedPrisonerSummaryPrisonerSession'

export type SessionListQueryStringParams = {
  page: number
  searchTerm?: string
  sessionType?: string
  sortOptions: { sortBy: SortBy; sortOrder: SortOrder }
}
