import { RequestHandler } from 'express'
import OverviewView from './overviewView'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, tab } = req.params

    const view = new OverviewView(tab, prisonNumber)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
