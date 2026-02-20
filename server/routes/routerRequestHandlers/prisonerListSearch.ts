import { NextFunction, Request, RequestHandler, Response } from 'express'
import { SearchService } from '../../services'
import SearchPlanStatus from '../../enums/searchPlanStatus'
import config from '../../config'
import { Result } from '../../utils/result/result'
import SortBy from '../../enums/sortBy'
import SortOrder from '../../enums/sortDirection'
import { PrisonUser } from '../../interfaces/hmppsUser'

const DEFAULT_SORT_FIELD = SortBy.RECEPTION_DATE
const DEFAULT_SORT_DIRECTION = SortOrder.DESCENDING

/**
 *  Middleware function that returns a Request handler function to call the LWP API /search endpoint in order to be able
 *  to render the Prisoner List (search) page.
 *
 *  The function populates 2 res.locals variables:
 *    * prisonerListResults - A wrapped promise (Result.wrap) containing a `PrisonerSearch` instance which contains the
 *                            search results and pagination data
 *    * searchOptions - A simple object containing the search options from the request so that the view can render them
 *                      (searchTerm, statusFilter, sortBy, sortOrder, and page)
 */
const prisonerListSearch = (searchService: SearchService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const prisonId = (res.locals.user as PrisonUser).activeCaseLoadId
    const { username } = req.user

    const page = parseInt((req.query.page as string) || '1', 10)
    const prisonerListUiPageSize = config.prisonerListUiDefaultPaginationPageSize

    const sortQueryStringValue = // sort options should be from query string, session, or defaults; in that order of preference
      (req.query.sort as string) ||
      req.session.prisonerListSortOptions ||
      `${DEFAULT_SORT_FIELD},${DEFAULT_SORT_DIRECTION}`
    const sortOptions = toSortOptions(sortQueryStringValue)
    const { sortBy, sortOrder } = sortOptions
    req.session.prisonerListSortOptions = `${sortBy},${sortOrder}` // save last sort options to session so that they are remembered when coming back to Prisoner List screen

    const searchTerm = req.query.searchTerm as string
    const statusFilter = Object.values(SearchPlanStatus).find(values => values === req.query.statusFilter)

    const { apiErrorCallback } = res.locals
    res.locals.prisonerListResults = await Result.wrap(
      searchService.searchPrisonersInPrison(
        prisonId,
        username,
        page,
        prisonerListUiPageSize,
        sortBy,
        sortOrder,
        searchTerm,
        statusFilter,
      ),
      apiErrorCallback,
    )
    res.locals.searchOptions = { searchTerm, statusFilter, sortBy, sortOrder, page }

    return next()
  }
}

/**
 * Returns an object describing the required sort options:
 * ```
 * {
 *   sortBy: SortBy
 *   sortOrder: SortOrder
 * }
 * ```
 * constructed from parsing the specified query string value which is expected to be a comma-delimited value
 * of field name (to sort by) and sort order.
 *
 * If the query string cannot be parsed, an object is returned describing the default sort field and direction.
 */
const toSortOptions = (queryStringValue: string): { sortBy: SortBy; sortOrder: SortOrder } => {
  const options = queryStringValue
    .trim()
    .split(',')
    .map(value => value.trim().toLowerCase())
  const sortBy = Object.values(SortBy).find(value => value === options[0])
  const sortOrder = Object.values(SortOrder).find(value => value === options[1])
  if (sortBy && sortOrder) {
    return { sortBy, sortOrder }
  }
  // Could not determine valid sort options from the query string value, return the default sort options
  return { sortBy: DEFAULT_SORT_FIELD, sortOrder: DEFAULT_SORT_DIRECTION }
}

export default prisonerListSearch
