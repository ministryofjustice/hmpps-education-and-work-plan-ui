import { RequestHandler } from 'express'
import { PrisonerListService } from '../../services'
import PrisonerListView from './prisonerListView'
import config from '../../config'
import PagedPrisonerSearchSummary, { FilterBy } from './pagedPrisonerSearchSummary'

export default class PrisonerListController {
  constructor(private readonly prisonerListService: PrisonerListService) {}

  getPrisonerListView: RequestHandler = async (req, res, next): Promise<void> => {
    const prisonId = res.locals.user.activeCaseLoadId
    const page = 0
    const pageSize = config.apis.prisonerSearch.defaultPageSize

    const searchTerm = req.query.searchTerm as string
    const statusFilter = req.query.statusFilter as string

    const prisonerList = await this.prisonerListService.getPrisonerSearchSummariesForPrisonId(
      prisonId,
      page,
      pageSize,
      req.user.username,
      req.user.token,
    )

    const pagedPrisonerSearchSummary = new PagedPrisonerSearchSummary(
      prisonerList,
      config.prisonerListUiDefaultPaginationPageSize,
    )
    if (searchTerm) {
      pagedPrisonerSearchSummary.filter(FilterBy.NAME, searchTerm)
    }
    if (statusFilter) {
      pagedPrisonerSearchSummary.filter(FilterBy.STATUS, statusFilter)
    }

    const view = new PrisonerListView(pagedPrisonerSearchSummary, searchTerm, statusFilter)

    res.render('pages/prisonerList/index', { ...view.renderArgs })
  }
}
