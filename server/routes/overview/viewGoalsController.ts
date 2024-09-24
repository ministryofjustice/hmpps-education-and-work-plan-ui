import { RequestHandler } from 'express'

export default class ViewGoalsController {
  viewInProgressGoals: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerSummary } = req.session
      const { prisonNumber } = req.params
      const { goals, problemRetrievingData, inProgressGoalsCount, archivedGoalsCount } = res.locals

      res.render('pages/overview/viewInProgressGoals', {
        prisonNumber,
        prisonerSummary,
        inProgressGoalsCount,
        archivedGoalsCount,
        goals,
        problemRetrievingData,
        activeTab: 'in-progress',
        tab: 'goals',
      })
    } catch (error) {
      next(error)
    }
  }

  viewArchivedGoals: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { prisonerSummary } = req.session
      const { prisonNumber } = req.params
      const { goals, problemRetrievingData, inProgressGoalsCount, archivedGoalsCount } = res.locals

      res.render('pages/overview/viewArchivedGoalsV2', {
        prisonNumber,
        prisonerSummary,
        inProgressGoalsCount,
        archivedGoalsCount,
        goals,
        problemRetrievingData,
        activeTab: 'archived',
        tab: 'goals',
      })
    } catch (error) {
      next(error)
    }
  }
}
