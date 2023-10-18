import { RequestHandler } from 'express'

export default class PrisonerListController {
  getPrisonerListView: RequestHandler = async (req, res, next): Promise<void> => {
    res.render('pages/prisonerList/index')
  }
}
