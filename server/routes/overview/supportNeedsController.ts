import { RequestHandler } from 'express'

export default class SupportNeedsController {
  getSupportNeedsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, prisonNamesById, prisonerSupportNeeds } = res.locals

    res.render('pages/overview/index', {
      tab: 'support-needs',
      prisonerSummary,
      prisonNamesById,
      supportNeeds: prisonerSupportNeeds,
    })
  }
}
