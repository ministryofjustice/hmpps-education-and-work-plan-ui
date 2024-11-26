import { RequestHandler } from 'express'
import type { PrisonerSupportNeeds } from 'viewModels'
import SupportNeedsView from './supportNeedsView'

export default class SupportNeedsController {
  getSupportNeedsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = res.locals

    const supportNeeds: PrisonerSupportNeeds = res.locals.prisonerSupportNeeds

    // Work out if any of the HealthAndSupportNeeds records contains any assessment data
    const atLeastOnePrisonHasSupportNeeds = supportNeeds.healthAndSupportNeeds.some(
      supportNeed => supportNeed.hasSupportNeeds,
    )

    const view = new SupportNeedsView(prisonerSummary, supportNeeds, atLeastOnePrisonHasSupportNeeds)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
