import { RequestHandler } from 'express'
import OverviewView from './overviewView'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { tab } = req.params

    const view = new OverviewView(tab)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
