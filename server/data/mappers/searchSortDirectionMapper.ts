import SearchSortDirection from '../../enums/searchSortDirection'
import SortOrder from '../../enums/sortDirection'

const toSearchSortDirection = (sortOrder: SortOrder): SearchSortDirection => {
  const mapping: Record<SortOrder, SearchSortDirection> = {
    [SortOrder.ASCENDING]: SearchSortDirection.ASC,
    [SortOrder.DESCENDING]: SearchSortDirection.DESC,
  }
  return mapping[sortOrder]
}

export default toSearchSortDirection
