import { RequestHandler } from 'express'
import { PrisonerListService } from '../../services'
import PrisonerListView from './prisonerListView'
import config from '../../config'
import PagedPrisonerSearchSummary from './pagedPrisonerSearchSummary'

export default class PrisonerListController {
  constructor(private readonly prisonerListService: PrisonerListService) {}

  getPrisonerListView: RequestHandler = async (req, res, next): Promise<void> => {
    const prisonId = res.locals.user.activeCaseLoadId
    const page = 0
    const pageSize = config.apis.prisonerSearch.defaultPageSize

    const prisonerList = await this.prisonerListService.getPrisonerSearchSummariesForPrisonId(
      prisonId,
      page,
      pageSize,
      req.user.username,
      req.user.token,
    )

    const view = new PrisonerListView(
      new PagedPrisonerSearchSummary(prisonerList, config.prisonerListUiDefaultPaginationPageSize),
    )

    res.render('pages/prisonerList/index', { ...view.renderArgs })
  }
}
