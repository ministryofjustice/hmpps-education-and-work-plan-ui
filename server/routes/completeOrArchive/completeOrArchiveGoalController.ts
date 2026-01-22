import type { RequestHandler } from 'express'

export default class CompleteOrArchiveGoalController {
  getCompleteOrArchiveGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, goal } = res.locals

    return res.render('pages/goal/completeorarchive/index', { prisonerSummary, goal, form: { archiveOrComplete: '' } })
  }

  submitCompleteOrArchiveGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const completeOrArchiveGoalForm = { ...req.body }
    if (completeOrArchiveGoalForm.archiveOrComplete === 'COMPLETE') {
      return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/complete`)
    }
    return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
  }
}
