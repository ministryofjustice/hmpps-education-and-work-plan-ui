import { RequestHandler } from 'express'
import toGroupedSupportStrategiesPromise from './mappers/groupedSupportStrategiesMapper'

export default class AdditionalNeedsController {
  getAdditionalNeedsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, prisonNamesById, curiousAlnAndLddAssessments, conditions, supportStrategies } = res.locals

    const supportStrategiesPromise = toGroupedSupportStrategiesPromise(supportStrategies)

    res.render('pages/overview/index', {
      tab: 'additional-needs',
      prisonerSummary,
      prisonNamesById,
      curiousAlnAndLddAssessments,
      conditions,
      groupedSupportStrategies: supportStrategiesPromise,
    })
  }
}
