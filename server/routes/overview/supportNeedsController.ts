import { RequestHandler } from 'express'
import type { PrisonerSupportNeeds } from 'viewModels'
import SupportNeedsView from './supportNeedsView'
import PrisonService from '../../services/prisonService'

export default class SupportNeedsController {
  constructor(private readonly prisonService: PrisonService) {}

  getSupportNeedsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = res.locals

    const supportNeeds: PrisonerSupportNeeds = res.locals.prisonerSupportNeeds
    const prisonNamesById = await this.prisonService.getAllPrisonNamesById(req.user.username)
    let atLeastOnePrisonHasSupportNeeds = false

    if (supportNeeds.healthAndSupportNeeds) {
      // Work out if any of the HealthAndSupportNeeds records contains any assessment data
      atLeastOnePrisonHasSupportNeeds = supportNeeds.healthAndSupportNeeds.some(
        supportNeed => supportNeed.hasSupportNeeds,
      )
      // Loop through the healthAndSupport needs array and update the prison name for each need
      supportNeeds.healthAndSupportNeeds = supportNeeds.healthAndSupportNeeds.map(supportNeed => {
        const prison = prisonNamesById.get(supportNeed.prisonId)
        return {
          ...supportNeed,
          prisonName: prison,
        }
      })
    }
    const view = new SupportNeedsView(prisonerSummary, supportNeeds, atLeastOnePrisonHasSupportNeeds)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
