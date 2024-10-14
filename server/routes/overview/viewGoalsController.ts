import { Request, Response, RequestHandler } from 'express'
import ViewGoalsView from './viewGoalsView'

export default class ViewGoalsController {
  private renderGoals: (req: Request, res: Response, isInProgressGoalsTab: boolean) => void = (
    req,
    res,
    isInProgressGoalsTab,
  ) => {
    const { prisonerSummary, allGoalsForPrisoner } = res.locals
    const currentUrlPath = req.baseUrl + req.path

    const view = new ViewGoalsView(prisonerSummary, allGoalsForPrisoner, isInProgressGoalsTab, currentUrlPath)

    res.render('pages/overview/partials/goalsTab/goalsTabContents', view.renderArgs)
  }

  viewInProgressGoals: RequestHandler = (req, res) => {
    this.renderGoals(req, res, true)
  }

  viewArchivedGoals: RequestHandler = (req, res) => {
    this.renderGoals(req, res, false)
  }
}
