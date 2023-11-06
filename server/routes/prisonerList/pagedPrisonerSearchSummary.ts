import moment from 'moment'
import type { PrisonerSearchSummary } from 'viewModels'

/**
 * A class encapsulating an array of [PrisonerSearchSummary] records, exposing them as a paged collection.
 * The class exposes methods to sort, filter, change page and return the current page of records.
 *
 * All fields that represent indexes (`currentPageNumber`, `resultIndexFrom` and `resultIndexTo`) are 1 indexed to make
 * it easier for view concerns to interact with this class.
 *
 * The internal state of this class is mutable. Of particular note is the internal array of [PrisonerSearchSummary] records
 * which is mutated by the `filter` method. Calling the `filter` method removes elements from the internal array of
 * [PrisonerSearchSummary] records, and this operation is not reversible.
 */
export default class PagedPrisonerSearchSummary {
  private prisonerSearchSummaries: PrisonerSearchSummary[]

  currentPageNumber: number

  totalPages: number

  pageSize: number

  totalResults: number

  resultIndexFrom: number

  resultIndexTo: number

  /**
   * Construct a new [PagedPrisonerSearchSummary] instance with the specified array of [PrisonerSearchSummary] records
   * and page size.
   */
  constructor(prisonerSearchSummaries: PrisonerSearchSummary[], pageSize: number) {
    this.prisonerSearchSummaries = prisonerSearchSummaries
    this.pageSize = pageSize
    this.totalPages = Math.max(Math.ceil(prisonerSearchSummaries.length / pageSize))
    this.setCurrentPageNumber(1)
  }

  /**
   * Sets the current page number.
   * Attempting to set the current page number to less than 1 will set the current page number to 1.
   * Attempting to set the current page number to a number greater than the total number of pages will set the current
   * page number to the last page number.
   *
   * This method also updates the `resultIndexFrom` and `resultIndexTo` fields to allow view concerns to be able to render
   * content such as "Showing records x thru y"
   */
  setCurrentPageNumber = (pageNumber: number): PagedPrisonerSearchSummary => {
    this.currentPageNumber = Math.min(Math.max(1, this.totalPages), Math.max(1, pageNumber))
    this.totalResults = this.prisonerSearchSummaries.length
    this.resultIndexFrom = Math.min(1 + (this.currentPageNumber - 1) * this.pageSize, this.totalResults)
    this.resultIndexTo = Math.min(this.resultIndexFrom + this.pageSize - 1, this.totalResults)
    return this
  }

  /**
   * Returns the current page of results based on the current page number and the page size.
   * If the current page is the last page, and there are fewer results that the page size, then only those records are
   * returned. This is the only time the current page results will return fewer than the configured page size.
   *
   * The returned array is a deep clone of the elements from the internal array. This means that mutating elements in
   * the returned array will not affect the elements in the internal array.
   */
  getCurrentPage = (): PrisonerSearchSummary[] =>
    structuredClone(this.prisonerSearchSummaries.slice(this.resultIndexFrom - 1, this.resultIndexTo))

  /**
   * Filters and replaces the internal array of [PrisonerSearchSummary] records based on the specified filter field and value.
   * This filters the entire array, not the content of the current page. Because it filters/removes elements from the entire array
   * this operation can impact the current page (ie. the current page may no longer exist), so the current page is
   * reset to page 1.
   *
   * This alters the internal array by filtering out (removing) elements.
   * This is not reversible, in that there is no way to 'undo' the filter. The only way to get the elements back is to
   * instantiate a new [PagedPrisonerSearchSummary] instance from the original array of [PrisonerSearchSummary] records.
   */
  filter = (filterBy: FilterBy, value: string): PagedPrisonerSearchSummary => {
    if (value && value.trim()) {
      this.prisonerSearchSummaries = this.prisonerSearchSummaries.filter(
        this.prisonerSearchSummaryFilter(filterBy, value),
      )
      this.totalPages = Math.max(1, Math.ceil(this.prisonerSearchSummaries.length / this.pageSize))
      this.totalResults = this.prisonerSearchSummaries.length
      this.setCurrentPageNumber(1)
    }

    return this
  }

  /**
   * Function that returns a [PrisonerSearchSummary] filter function that operates on the specified filter field
   * and filter value.
   */
  private prisonerSearchSummaryFilter =
    (filterBy: FilterBy, value: string) =>
    (prisonerSearchSummary: PrisonerSearchSummary): boolean => {
      switch (filterBy) {
        case FilterBy.NAME:
          return (
            prisonerSearchSummary.lastName.toUpperCase().includes(value.trim().toUpperCase()) ||
            prisonerSearchSummary.firstName.toUpperCase().includes(value.trim().toUpperCase())
          )
        case FilterBy.STATUS:
          return sortableFilterableStatus(prisonerSearchSummary) === value
        default:
          return true
      }
    }

  /**
   * Sorts the internal array of [PrisonerSearchSummary] records based on the specified sort field and sort order.
   * Other than changing the order of the internal array this does not mutate the array or individual records.
   *
   * This sorts the entire array, not just the current page. Because this is simply a sorting / re-ordering operation
   * it does not remove any records, therefore the current page can be maintained (though the current page may
   * contain different records than before the sort operation was performed)
   */
  sort = (sortBy: SortBy, sortOrder: SortOrder): PagedPrisonerSearchSummary => {
    this.prisonerSearchSummaries = this.prisonerSearchSummaries.sort(
      this.prisonerSearchSummariesComparator(sortBy, sortOrder),
    )
    return this
  }

  /**
   * Function that returns a [PrisonerSearchSummary] comparator function that operates on the specified sort field
   * and sort order.
   */
  private prisonerSearchSummariesComparator =
    (sortBy: SortBy, sortOrder: SortOrder) =>
    (left: PrisonerSearchSummary, right: PrisonerSearchSummary): number => {
      switch (sortBy) {
        case SortBy.NAME: {
          if (sortableName(left) === sortableName(right)) {
            return 0
          }
          if (sortableName(left) > sortableName(right)) {
            return sortOrder === SortOrder.ASCENDING ? 1 : -1
          }
          return sortOrder === SortOrder.ASCENDING ? -1 : 1
        }
        case SortBy.LOCATION: {
          if (left.location === right.location) {
            return 0
          }
          if (left.location > right.location) {
            return sortOrder === SortOrder.ASCENDING ? 1 : -1
          }
          return sortOrder === SortOrder.ASCENDING ? -1 : 1
        }
        case SortBy.RELEASE_DATE: {
          if (sortableDate(left.releaseDate) === sortableDate(right.releaseDate)) {
            return 0
          }
          if (sortableDate(left.releaseDate) > sortableDate(right.releaseDate)) {
            return sortOrder === SortOrder.ASCENDING ? 1 : -1
          }
          return sortOrder === SortOrder.ASCENDING ? -1 : 1
        }
        case SortBy.RECEPTION_DATE: {
          if (sortableDate(left.receptionDate) === sortableDate(right.receptionDate)) {
            return 0
          }
          if (sortableDate(left.receptionDate) > sortableDate(right.receptionDate)) {
            return sortOrder === SortOrder.ASCENDING ? 1 : -1
          }
          return sortOrder === SortOrder.ASCENDING ? -1 : 1
        }
        case SortBy.STATUS: {
          if (sortableFilterableStatus(left) === sortableFilterableStatus(right)) {
            return 0
          }
          if (sortableFilterableStatus(left) > sortableFilterableStatus(right)) {
            return sortOrder === SortOrder.ASCENDING ? 1 : -1
          }
          return sortOrder === SortOrder.ASCENDING ? -1 : 1
        }
        default: {
          return 0
        }
      }
    }
}

/**
 * Return the prisoner's name in the format `LASTNAME-FORENAME` for the purpose of sorting
 */
const sortableName = (prisonerSearchSummary: PrisonerSearchSummary): string =>
  `${prisonerSearchSummary.lastName.trim().toUpperCase()}-${prisonerSearchSummary.firstName.trim().toUpperCase()}`

/**
 * Return the specified date, unless it is null/undefined, in which case return the maximum possible date; for th purpose of sorting
 * Javascript's max date is +275760-09-13T00:00:00.000Z
 */
const sortableDate = (date?: Date): Date => date || moment(8640000000000000).toDate()

/**
 * Returns the status for the purpose of sorting and filtering. Currently, we only support one status (NEEDS_PLAN)
 */
const sortableFilterableStatus = (prisonerSearchSummary: PrisonerSearchSummary): string =>
  prisonerSearchSummary.hasCiagInduction && prisonerSearchSummary.hasActionPlan ? '' : 'NEEDS_PLAN'

export enum SortBy {
  NAME = 'name',
  RELEASE_DATE = 'release-date',
  RECEPTION_DATE = 'reception-date',
  LOCATION = 'location',
  STATUS = 'status',
}

export enum SortOrder {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export enum FilterBy {
  NAME,
  STATUS,
}
