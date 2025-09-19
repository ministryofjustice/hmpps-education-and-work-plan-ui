import { RequestHandler } from 'express'

export default class AdditionalNeedsController {
  getAdditionalNeedsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, prisonNamesById, prisonerSupportNeeds } = res.locals

    res.render('pages/overview/index', {
      tab: 'additional-needs',
      prisonerSummary,
      prisonNamesById,
      supportNeeds: prisonerSupportNeeds,
    })
  }
}
