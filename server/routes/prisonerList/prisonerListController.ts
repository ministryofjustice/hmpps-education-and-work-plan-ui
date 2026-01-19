import { RequestHandler } from 'express'
import createError from 'http-errors'
import { PrisonerListService } from '../../services'
import PrisonerListView from './prisonerListView'
import config from '../../config'
import PagedPrisonerSearchSummary, { FilterBy, SortBy, SortOrder } from './pagedPrisonerSearchSummary'
import logger from '../../../logger'

const DEFAULT_SORT_FIELD = SortBy.RECEPTION_DATE
const DEFAULT_SORT_DIRECTION = SortOrder.DESCENDING

export default class PrisonerListController {
  constructor(private readonly prisonerListService: PrisonerListService) {}

  getPrisonerListView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerListResults, searchOptions } = res.locals
    return res.render('pages/prisonerList/index', { prisonerListResults, searchOptions })
  }

  /**
   * @deprecated - this uses the old way of getting prisoner lists / filtering, sorting & pagination.
   * Use getPrisonerListView instead.
   */
  getOldPrisonerListView: RequestHandler = async (req, res, next): Promise<void> => {
    const prisonId = res.locals.user.activeCaseLoadId

    try {
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
      const sortQueryStringValue = // sort options should be from query string, session, or defaults; in that order of preference
        (req.query.sort as string) ||
        req.session.prisonerListSortOptions ||
        `${DEFAULT_SORT_FIELD.toString()},${DEFAULT_SORT_DIRECTION.toString()}`
      const sortOptions = toSortOptions(sortQueryStringValue)
      pagedPrisonerSearchSummary.sort(sortOptions.sortBy, sortOptions.sortOrder)
      req.session.prisonerListSortOptions = `${sortOptions.sortBy.toString()},${sortOptions.sortOrder.toString()}` // save last sort options to session so that they are remembered when coming back to Prisoner List screen

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

      return res.render('pages/prisonerList/index', { ...view.renderArgs })
    } catch (error) {
      logger.error(`Error producing prisoner list for prison ${prisonId}`, error)
      return next(createError(500, `Error producing prisoner list for prison ${prisonId}`))
    }
  }

  private getPagedPrisonerSearchSummaryForAllPrisoners = async (
    prisonId: string,
    user: Express.User,
  ): Promise<PagedPrisonerSearchSummary> => {
    const prisonerListUiPageSize = config.prisonerListUiDefaultPaginationPageSize

    const prisonerList = await this.prisonerListService.getPrisonerSearchSummariesForPrisonId(prisonId, user.username)
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
