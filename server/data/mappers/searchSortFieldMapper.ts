import SearchSortField from '../../enums/searchSortField'
import SortBy from '../../enums/sortBy'

const toSearchSortField = (sortBy: SortBy): SearchSortField => {
  const mapping: Record<SortBy, SearchSortField> = {
    [SortBy.NAME]: SearchSortField.PRISONER_NAME,
    [SortBy.RECEPTION_DATE]: SearchSortField.ENTERED_PRISON_DATE,
    [SortBy.RELEASE_DATE]: SearchSortField.RELEASE_DATE,
    [SortBy.LOCATION]: SearchSortField.CELL_LOCATION,
    [SortBy.STATUS]: SearchSortField.PLAN_STATUS,
  }
  return mapping[sortBy]
}

export default toSearchSortField
