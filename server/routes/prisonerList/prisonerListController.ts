import { RequestHandler } from 'express'
import { PrisonerListService } from '../../services'
import PrisonerListView from './prisonerListView'
import config from '../../config'
import PagedPrisonerSearchSummary, { FilterBy, SortBy, SortOrder } from './pagedPrisonerSearchSummary'

const DEFAULT_SORT_FIELD = SortBy.NAME
const DEFAULT_SORT_DIRECTION = SortOrder.ASCENDING

export default class PrisonerListController {
  constructor(private readonly prisonerListService: PrisonerListService) {}

  getPrisonerListView: RequestHandler = async (req, res, next): Promise<void> => {
    const prisonId = res.locals.user.activeCaseLoadId

    const pagedPrisonerSearchSummary = await this.getPagedPrisonerSearchSummaryForAllPrisoners(prisonId, req.user)

    // Apply filtering first if specified on the query string parameters
    const searchTerm = req.query.searchTerm as string
    const statusFilter = req.query.statusFilter as string
    if (searchTerm) {
      pagedPrisonerSearchSummary.filter(FilterBy.NAME, searchTerm)
    }
    if (statusFilter) {
      pagedPrisonerSearchSummary.filter(FilterBy.STATUS, statusFilter)
    }

    // Apply sorting
    const sortQueryStringValue =
      (req.query.sort as string) || `${DEFAULT_SORT_FIELD.toString()},${DEFAULT_SORT_DIRECTION.toString()}`
    const sortOptions = toSortOptions(sortQueryStringValue)
    pagedPrisonerSearchSummary.sort(sortOptions.sortBy, sortOptions.sortOrder)

    // Apply paging
    const page = req.query.page as string
    pagedPrisonerSearchSummary.setCurrentPageNumber(page ? parseInt(page, 10) : 1)

    const view = new PrisonerListView(
      pagedPrisonerSearchSummary,
      searchTerm || '',
      statusFilter || '',
      sortOptions.sortBy.toString(),
      sortOptions.sortOrder.toString(),
    )

    res.render('pages/prisonerList/index', { ...view.renderArgs })
  }

  getPagedPrisonerSearchSummaryForAllPrisoners = async (
    prisonId: string,
    user: Express.User,
  ): Promise<PagedPrisonerSearchSummary> => {
    const prisonerSearchApiPageZero = 0
    const prisonerSearchApiPageSize = config.apis.prisonerSearch.defaultPageSize
    const prisonerListUiPageSize = config.prisonerListUiDefaultPaginationPageSize

    const prisonerList = await this.prisonerListService.getPrisonerSearchSummariesForPrisonId(
      prisonId,
      prisonerSearchApiPageZero,
      prisonerSearchApiPageSize,
      user.username,
      user.token,
    )
    return new PagedPrisonerSearchSummary(prisonerList, prisonerListUiPageSize)
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
 * constructed from parsing the specified query string value which is expected to be a comma delimited valye
 * of field name (to sort by) and sort order.
 *
 * If the query string cannot be parsed, an object is returned describing the default sort field and direction.
 */
const toSortOptions = (queryStringValue: string): { sortBy: SortBy; sortOrder: SortOrder } => {
  const options = queryStringValue
    .trim()
    .split(',')
    .map(value => value.trim().toLowerCase())
  const sortByString = options[0]
  const sortBy = Object.values(SortBy).find(value => value === sortByString)
  const sortOrderString = options[1]
  const sortOrder = Object.values(SortOrder).find(value => value === sortOrderString)
  if (sortBy && sortBy) {
    return { sortBy, sortOrder }
  }
  // Could not determine valid sort options from the query string value, return the default sort options
  return { sortBy: DEFAULT_SORT_FIELD, sortOrder: DEFAULT_SORT_DIRECTION }
}
