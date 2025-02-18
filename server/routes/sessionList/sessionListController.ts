import { NextFunction, Request, RequestHandler, Response } from 'express'
import SessionListView from './sessionListView'
import { PrisonerSearchService, SessionService } from '../../services'
import SessionStatusValue from '../../enums/sessionStatusValue'
import PagedPrisonerSummaryPrisonerSession, { FilterBy, SortBy, SortOrder } from './pagedPrisonerSummaryPrisonerSession'
import config from '../../config'
import { SessionListQueryStringParams } from './sessionListQueryStringParams'

const DEFAULT_SORT_FIELD = SortBy.DUE_BY
const DEFAULT_SORT_DIRECTION = SortOrder.DESCENDING

export default class SessionListController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly sessionService: SessionService,
  ) {}

  getDueSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      sessionsSummary,
      user: { activeCaseLoadId, username },
    } = res.locals

    const queryStringParams = extractQueryStringParams(req)
    req.session.sessionListSortOptions = `${queryStringParams.sortOptions.sortBy.toString()},${queryStringParams.sortOptions.sortOrder.toString()}` // save last sort options to session so that they are remembered when coming back to Session List screen

    const pagedPrisonerSummaryPrisonerSessions =
      await this.getPagedPrisonerSummaryPrisonerSessionsForAllPrisonersInPrison(
        activeCaseLoadId,
        username,
        SessionStatusValue.DUE,
      )
    applyFilteringSortingAndPaging(pagedPrisonerSummaryPrisonerSessions, queryStringParams)

    const view = new SessionListView(sessionsSummary, pagedPrisonerSummaryPrisonerSessions, queryStringParams)
    return res.render('pages/sessionList/dueSessions', { ...view.renderArgs })
  }

  getOverdueSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      sessionsSummary,
      user: { activeCaseLoadId, username },
    } = res.locals

    const queryStringParams = extractQueryStringParams(req)
    req.session.sessionListSortOptions = `${queryStringParams.sortOptions.sortBy.toString()},${queryStringParams.sortOptions.sortOrder.toString()}` // save last sort options to session so that they are remembered when coming back to Session List screen

    const pagedPrisonerSummaryPrisonerSessions =
      await this.getPagedPrisonerSummaryPrisonerSessionsForAllPrisonersInPrison(
        activeCaseLoadId,
        username,
        SessionStatusValue.OVERDUE,
      )
    applyFilteringSortingAndPaging(pagedPrisonerSummaryPrisonerSessions, queryStringParams)

    const view = new SessionListView(sessionsSummary, pagedPrisonerSummaryPrisonerSessions, queryStringParams)
    return res.render('pages/sessionList/overdueSessions', { ...view.renderArgs })
  }

  getOnHoldSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      sessionsSummary,
      user: { activeCaseLoadId, username },
    } = res.locals

    const queryStringParams = extractQueryStringParams(req)
    req.session.sessionListSortOptions = `${queryStringParams.sortOptions.sortBy.toString()},${queryStringParams.sortOptions.sortOrder.toString()}` // save last sort options to session so that they are remembered when coming back to Session List screen

    const pagedPrisonerSummaryPrisonerSessions =
      await this.getPagedPrisonerSummaryPrisonerSessionsForAllPrisonersInPrison(
        activeCaseLoadId,
        username,
        SessionStatusValue.ON_HOLD,
      )
    applyFilteringSortingAndPaging(pagedPrisonerSummaryPrisonerSessions, queryStringParams)

    const view = new SessionListView(sessionsSummary, pagedPrisonerSummaryPrisonerSessions, queryStringParams)
    return res.render('pages/sessionList/onHoldSessions', { ...view.renderArgs })
  }

  private getPagedPrisonerSummaryPrisonerSessionsForAllPrisonersInPrison = async (
    activeCaseLoadId: string,
    username: string,
    status: SessionStatusValue,
  ): Promise<PagedPrisonerSummaryPrisonerSession> => {
    const sessionListUiPageSize = config.sessionListUiDefaultPaginationPageSize
    const prisonerSummaries = (await this.prisonerSearchService.getPrisonersByPrisonId(activeCaseLoadId, username))
      .prisoners
    const prisonNumbers = prisonerSummaries.map(prisoner => prisoner.prisonNumber)

    const prisonerSessions = (
      await this.sessionService.getSessionsInStatusForPrisoners(prisonNumbers, status, username)
    ).sessions

    const prisonerSummaryPrisonerSessions = prisonerSessions.map(prisonerSession => {
      const prisonerSummary = prisonerSummaries.find(prisoner => prisoner.prisonNumber === prisonerSession.prisonNumber)
      return {
        ...prisonerSession,
        ...prisonerSummary,
      }
    })

    return new PagedPrisonerSummaryPrisonerSession(prisonerSummaryPrisonerSessions, sessionListUiPageSize)
  }
}

const extractQueryStringParams = (req: Request): SessionListQueryStringParams => {
  const page = req.query.page as string
  const searchTerm = (req.query.searchTerm as string) || ''
  const sessionType = (req.query.sessionType as string) || ''

  const sortQueryStringValue = // sort options should be from query string, session, or defaults; in that order of preference
    (req.query.sort as string) ||
    req.session.sessionListSortOptions ||
    `${DEFAULT_SORT_FIELD.toString()},${DEFAULT_SORT_DIRECTION.toString()}`
  const sortOptions = toSortOptions(sortQueryStringValue)

  return { page: page ? parseInt(page, 10) : 1, searchTerm, sessionType, sortOptions }
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

const applyFilteringSortingAndPaging = (
  pagedPrisonerSummaryPrisonerSession: PagedPrisonerSummaryPrisonerSession,
  qsParams: SessionListQueryStringParams,
) => {
  // Apply filtering first if specified on the query string parameters
  if (qsParams.searchTerm) {
    pagedPrisonerSummaryPrisonerSession.filter(FilterBy.NAME, qsParams.searchTerm)
  }
  if (qsParams.sessionType) {
    pagedPrisonerSummaryPrisonerSession.filter(FilterBy.SESSION_TYPE, qsParams.sessionType)
  }

  // Apply sorting
  pagedPrisonerSummaryPrisonerSession.sort(qsParams.sortOptions.sortBy, qsParams.sortOptions.sortOrder)

  // Apply paging
  pagedPrisonerSummaryPrisonerSession.setCurrentPageNumber(qsParams.page)
}
