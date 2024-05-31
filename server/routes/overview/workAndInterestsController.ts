import { RequestHandler } from 'express'
import WorkAndInterestsView from './workAndInterestsView'
import { InductionService } from '../../services'

export default class WorkAndInterestsController {
  constructor(private readonly inductionService: InductionService) {}

  getWorkAndInterestsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const workAndInterests = await this.inductionService.getWorkAndInterests(prisonNumber, req.user.token)
    const view = new WorkAndInterestsView(prisonerSummary, workAndInterests)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
