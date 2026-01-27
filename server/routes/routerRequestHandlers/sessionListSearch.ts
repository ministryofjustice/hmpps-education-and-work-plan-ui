import { NextFunction, Request, RequestHandler, Response } from 'express'
import { SessionService } from '../../services'
import config from '../../config'
import { Result } from '../../utils/result/result'
import SortOrder from '../../enums/sortDirection'
import SessionSortBy from '../../enums/sessionSortBy'
import SessionStatusValue from '../../enums/sessionStatusValue'
import SessionTypeValue from '../../enums/sessionTypeValue'

const DEFAULT_SORT_FIELD = SessionSortBy.DUE_BY
const DEFAULT_SORT_DIRECTION = SortOrder.ASCENDING

/**
 *  Middleware function that returns a Request handler function to call the LWP API session /search endpoint in order to be able
 *  to render the Session List Search page.
 *
 *  The function populates 2 res.locals variables:
 *    * sessionListSearchResults - A wrapped promise (Result.wrap) containing a `SessionSearch` instance which contains the
 *                                 search results and pagination data
 *    * searchOptions - A simple object containing the search options from the request so that the view can render them
 *                      (searchTerm, sessionType, sortBy, sortOrder, and page)
 */
const sessionListSearch = (sessionService: SessionService, sessionStatusType: SessionStatusValue): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const prisonId = res.locals.user.activeCaseLoadId
    const { username } = req.user

    const page = parseInt((req.query.page as string) || '1', 10)
    const sessionListUiPageSize = config.sessionListUiDefaultPaginationPageSize

    const sortQueryStringValue = // sort options should be from query string, session, or defaults; in that order of preference
      (req.query.sort as string) ||
      req.session.sessionListSortOptions ||
      `${DEFAULT_SORT_FIELD},${DEFAULT_SORT_DIRECTION}`
    const sortOptions = toSortOptions(sortQueryStringValue)
    const { sortBy, sortOrder } = sortOptions
    req.session.sessionListSortOptions = `${sortBy},${sortOrder}` // save last sort options to session so that they are remembered when coming back to Session List screen

    const searchTerm = req.query.searchTerm as string
    const sessionType = Object.values(SessionTypeValue).find(values => values === req.query.sessionType)

    const { apiErrorCallback } = res.locals
    res.locals.sessionListSearchResults = await Result.wrap(
      sessionService.searchSessionsInPrison(
        prisonId,
        username,
        page,
        sessionListUiPageSize,
        sortBy,
        sortOrder,
        sessionStatusType,
        searchTerm,
        sessionType,
      ),
      apiErrorCallback,
    )
    res.locals.searchOptions = { searchTerm, sessionType, sortBy, sortOrder, page }

    return next()
  }
}

/**
 * Returns an object describing the required sort options:
 * ```
 * {
 *   sortBy: SessionSortBy
 *   sortOrder: SortOrder
 * }
 * ```
 * constructed from parsing the specified query string value which is expected to be a comma-delimited value
 * of field name (to sort by) and sort order.
 *
 * If the query string cannot be parsed, an object is returned describing the default sort field and direction.
 */
const toSortOptions = (queryStringValue: string): { sortBy: SessionSortBy; sortOrder: SortOrder } => {
  const options = queryStringValue
    .trim()
    .split(',')
    .map(value => value.trim().toLowerCase())
  const sortBy = Object.values(SessionSortBy).find(value => value === options[0])
  const sortOrder = Object.values(SortOrder).find(value => value === options[1])
  if (sortBy && sortOrder) {
    return { sortBy, sortOrder }
  }
  // Could not determine valid sort options from the query string value, return the default sort options
  return { sortBy: DEFAULT_SORT_FIELD, sortOrder: DEFAULT_SORT_DIRECTION }
}

export default sessionListSearch
