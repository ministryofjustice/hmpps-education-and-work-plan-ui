import { maxTime } from 'date-fns/constants'
import type { PrisonerSummaryPrisonerSession } from 'viewModels'
import SessionTypeValue from '../../enums/sessionTypeValue'
import formatReviewExemptionReasonFilter from '../../filters/formatReviewExemptionReasonFilter'
import formatInductionExemptionReasonFilter from '../../filters/formatInductionExemptionReasonFilter'

/**
 * A class encapsulating an array of [PrisonerSummaryPrisonerSession] records, exposing them as a paged collection.
 * The class exposes methods to sort, filter, change page and return the current page of records.
 *
 * All fields that represent indexes (`currentPageNumber`, `resultIndexFrom` and `resultIndexTo`) are 1 indexed to make
 * it easier for view concerns to interact with this class.
 *
 * The internal state of this class is mutable. Of particular note is the internal array of [PrisonerSummaryPrisonerSession] records
 * which is mutated by the `filter` method. Calling the `filter` method removes elements from the internal array of
 * [PrisonerSummaryPrisonerSession] records, and this operation is not reversible.
 */
export default class PagedPrisonerSummaryPrisonerSession {
  private prisonerSummaryPrisonerSessions: PrisonerSummaryPrisonerSession[]

  currentPageNumber: number

  totalPages: number

  pageSize: number

  totalResults: number

  resultIndexFrom: number

  resultIndexTo: number

  /**
   * Construct a new [PagedPrisonerSummaryPrisonerSession] instance with the specified array of [PrisonerSummaryPrisonerSession] records
   * and page size.
   */
  constructor(prisonerSummaryPrisonerSessions: PrisonerSummaryPrisonerSession[], pageSize: number) {
    this.prisonerSummaryPrisonerSessions = prisonerSummaryPrisonerSessions
    this.pageSize = pageSize
    this.totalPages = Math.max(Math.ceil(prisonerSummaryPrisonerSessions.length / pageSize))
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
  setCurrentPageNumber = (pageNumber: number): PagedPrisonerSummaryPrisonerSession => {
    this.currentPageNumber = Math.min(Math.max(1, this.totalPages), Math.max(1, pageNumber))
    this.totalResults = this.prisonerSummaryPrisonerSessions.length
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
  getCurrentPage = (): PrisonerSummaryPrisonerSession[] =>
    structuredClone(this.prisonerSummaryPrisonerSessions.slice(this.resultIndexFrom - 1, this.resultIndexTo))

  /**
   * Filters and replaces the internal array of [PrisonerSummaryPrisonerSession] records based on the specified filter field and value.
   * This filters the entire array, not the content of the current page. Because it filters/removes elements from the entire array
   * this operation can impact the current page (ie. the current page may no longer exist), so the current page is
   * reset to page 1.
   *
   * This alters the internal array by filtering out (removing) elements.
   * This is not reversible, in that there is no way to 'undo' the filter. The only way to get the elements back is to
   * instantiate a new [PagedPrisonerSummaryPrisonerSession] instance from the original array of [PrisonerSummaryPrisonerSession] records.
   */
  filter = (filterBy: FilterBy, value: string): PagedPrisonerSummaryPrisonerSession => {
    if (value && value.trim()) {
      this.prisonerSummaryPrisonerSessions = this.prisonerSummaryPrisonerSessions.filter(
        this.prisonerSearchSummaryFilter(filterBy, value),
      )
      this.totalPages = Math.max(1, Math.ceil(this.prisonerSummaryPrisonerSessions.length / this.pageSize))
      this.totalResults = this.prisonerSummaryPrisonerSessions.length
      this.setCurrentPageNumber(1)
    }

    return this
  }

  /**
   * Function that returns a [PrisonerSummaryPrisonerSession] filter function that operates on the specified filter field
   * and filter value.
   */
  private prisonerSearchSummaryFilter =
    (filterBy: FilterBy, value: string) =>
    (prisonerSearchSummary: PrisonerSummaryPrisonerSession): boolean => {
      switch (filterBy) {
        case FilterBy.NAME: {
          const searchTerms = [
            prisonerSearchSummary.prisonNumber.toUpperCase(), // eg: A1234BB
            prisonerSearchSummary.firstName.toUpperCase(), // eg: FIRSTNAME
            prisonerSearchSummary.lastName.toUpperCase(), // eg: SURNAME
            `${prisonerSearchSummary.firstName}, ${prisonerSearchSummary.lastName}`.toUpperCase(), // eg: FIRSTNAME, SURNAME
            `${prisonerSearchSummary.firstName} ${prisonerSearchSummary.lastName}`.toUpperCase(), // eg: FIRSTNAME SURNAME
            `${prisonerSearchSummary.lastName}, ${prisonerSearchSummary.firstName}`.toUpperCase(), // eg: SURNAME, FIRSTNAME
            `${prisonerSearchSummary.lastName} ${prisonerSearchSummary.firstName}`.toUpperCase(), // eg: SURNAME FIRSTNAME
            `${prisonerSearchSummary.firstName.charAt(0)} ${prisonerSearchSummary.lastName}`.toUpperCase(), // eg: F SURNAME
          ]
          return searchTerms.some(searchTerm => searchTerm.includes(value.trim().toUpperCase()))
        }
        case FilterBy.SESSION_TYPE:
          return prisonerSearchSummary.sessionType === value
        default:
          return true
      }
    }

  /**
   * Sorts the internal array of [PrisonerSummaryPrisonerSession] records based on the specified sort field and sort order.
   * Other than changing the order of the internal array this does not mutate the array or individual records.
   *
   * This sorts the entire array, not just the current page. Because this is simply a sorting / re-ordering operation
   * it does not remove any records, therefore the current page can be maintained (though the current page may
   * contain different records than before the sort operation was performed)
   */
  sort = (sortBy: SortBy, sortOrder: SortOrder): PagedPrisonerSummaryPrisonerSession => {
    this.prisonerSummaryPrisonerSessions = this.prisonerSummaryPrisonerSessions.sort(
      this.prisonerSearchSummariesComparator(sortBy, sortOrder),
    )
    return this
  }

  /**
   * Function that returns a [PrisonerSummaryPrisonerSession] comparator function that operates on the specified sort field
   * and sort order.
   */
  private prisonerSearchSummariesComparator =
    (sortBy: SortBy, sortOrder: SortOrder) =>
    (left: PrisonerSummaryPrisonerSession, right: PrisonerSummaryPrisonerSession): number => {
      switch (sortBy) {
        case SortBy.NAME: {
          return compare(sortableName(left), sortableName(right), sortOrder)
        }
        case SortBy.LOCATION: {
          return compare(left.location, right.location, sortOrder)
        }
        case SortBy.RELEASE_DATE: {
          return compare(sortableDate(left.releaseDate), sortableDate(right.releaseDate), sortOrder)
        }
        case SortBy.SESSION_TYPE: {
          return compare(left.sessionType, right.sessionType, sortOrder)
        }
        case SortBy.DUE_BY: {
          return compare(sortableDate(left.deadlineDate), sortableDate(right.deadlineDate), sortOrder)
        }
        case SortBy.EXEMPTION_DATE: {
          return compare(
            sortableDate(left.exemption?.exemptionDate),
            sortableDate(right.exemption?.exemptionDate),
            sortOrder,
          )
        }
        case SortBy.EXEMPTION_REASON: {
          return compare(sortableExemptionReason(left), sortableExemptionReason(right), sortOrder)
        }
        default: {
          return 0
        }
      }
    }
}

const compare = (left: string | Date, right: string | Date, sortOrder: SortOrder) => {
  if (left === right) {
    return 0
  }
  if (left > right) {
    return sortOrder === SortOrder.ASCENDING ? 1 : -1
  }
  return sortOrder === SortOrder.ASCENDING ? -1 : 1
}

/**
 * Return the prisoner's name in the format `LASTNAME-FORENAME` for the purpose of sorting
 */
const sortableName = (prisonerSearchSummary: PrisonerSummaryPrisonerSession): string =>
  `${prisonerSearchSummary.lastName.trim().toUpperCase()}-${prisonerSearchSummary.firstName.trim().toUpperCase()}`

/**
 * Return the UI display text for the exemption reason, allowing for correct alphabetic sorting based on the on-screen
 * value, rather than it's enum value.
 */
const sortableExemptionReason = (prisonerSearchSummary: PrisonerSummaryPrisonerSession): string => {
  if (prisonerSearchSummary.exemption) {
    return prisonerSearchSummary.sessionType === SessionTypeValue.INDUCTION
      ? formatInductionExemptionReasonFilter(prisonerSearchSummary.exemption.exemptionReason)
      : formatReviewExemptionReasonFilter(prisonerSearchSummary.exemption.exemptionReason)
  }
  return ''
}

/**
 * Return the specified date, unless it is null/undefined, in which case return the maximum possible date; for the purpose of sorting
 * Javascript's max date is +275760-09-13T00:00:00.000Z
 */
const sortableDate = (date?: Date): Date => date || new Date(maxTime)

export enum SortBy {
  NAME = 'name',
  RELEASE_DATE = 'release-date',
  LOCATION = 'location',
  SESSION_TYPE = 'session-type',
  DUE_BY = 'due-by',
  EXEMPTION_DATE = 'exemption-entered-on',
  EXEMPTION_REASON = 'exemption-reason',
}

export enum SortOrder {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export enum FilterBy {
  NAME,
  SESSION_TYPE,
}
