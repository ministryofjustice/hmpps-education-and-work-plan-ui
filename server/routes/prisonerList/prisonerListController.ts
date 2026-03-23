import { RequestHandler } from 'express'

export default class PrisonerListController {
  getPrisonerListView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerListResults, searchOptions } = res.locals
    return res.render('pages/prisonerList/index', { prisonerListResults, searchOptions })
  }
}
