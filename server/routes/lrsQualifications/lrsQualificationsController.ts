import { RequestHandler } from 'express'

export default class LrsQualificationsController {
  getLrsQualificationsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, verifiedQualifications } = res.locals

    res.render('pages/lrsQualifications/index', {
      prisonerSummary,
      verifiedQualifications,
    })
  }
}
