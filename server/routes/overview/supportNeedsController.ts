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

    // Loop through the healthAndSupport needs array and update the prison name for each need
    if (supportNeeds.healthAndSupportNeeds) {
      await Promise.all(
        supportNeeds.healthAndSupportNeeds.map(async supportNeed => {
          const prison = await this.prisonService.getPrisonByPrisonId(supportNeed.prisonId, req.user.username)
          if (prison) {
            // TODO refactor to avoid param-reassign eslint rule
            // eslint-disable-next-line no-param-reassign
            supportNeed.prisonName = prison.prisonName
          }
        }),
      )
    }

    // Loop through the neurodiversities needs array and update the prison name for each need
    if (supportNeeds.neurodiversities) {
      await Promise.all(
        supportNeeds.neurodiversities.map(async supportNeed => {
          const prison = await this.prisonService.getPrisonByPrisonId(supportNeed.prisonId, req.user.username)
          if (prison) {
            // TODO refactor to avoid param-reassign eslint rule
            // eslint-disable-next-line no-param-reassign
            supportNeed.prisonName = prison.prisonName
          }
        }),
      )
    }

    const view = new SupportNeedsView(prisonerSummary, supportNeeds)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
