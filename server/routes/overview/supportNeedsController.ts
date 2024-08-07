import { RequestHandler } from 'express'
import SupportNeedsView from './supportNeedsView'
import { CuriousService } from '../../services'
import PrisonService from '../../services/prisonService'

export default class SupportNeedsController {
  constructor(
    private readonly curiousService: CuriousService,
    private readonly prisonService: PrisonService,
  ) {}

  getSupportNeedsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const supportNeeds = await this.curiousService.getPrisonerSupportNeeds(prisonNumber, req.user.username)
    const prisonNamesById = await this.prisonService.getAllPrisonNamesById(req.user.username)

    // Loop through the healthAndSupport needs array and update the prison name for each need
    if (supportNeeds.healthAndSupportNeeds) {
      supportNeeds.healthAndSupportNeeds.map(async supportNeed => {
        const prison = prisonNamesById.get(supportNeed.prisonId)
        if (prison) {
          // TODO refactor to avoid param-reassign eslint rule
          // eslint-disable-next-line no-param-reassign
          supportNeed.prisonName = prison
        }
      })
    }

    // Loop through the neurodiversities needs array and update the prison name for each need
    if (supportNeeds.neurodiversities) {
      supportNeeds.neurodiversities.map(async supportNeed => {
        const prison = prisonNamesById.get(supportNeed.prisonId)
        if (prison) {
          // TODO refactor to avoid param-reassign eslint rule
          // eslint-disable-next-line no-param-reassign
          supportNeed.prisonName = prison
        }
      })
    }

    const view = new SupportNeedsView(prisonerSummary, supportNeeds)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
