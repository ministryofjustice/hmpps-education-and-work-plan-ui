import { RequestHandler } from 'express'

export default class EmployabilitySkillsController {
  getEmployabilitySkillsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, employabilitySkills } = res.locals

    res.render('pages/overview/index', {
      tab: 'employability-skills',
      prisonerSummary,
      employabilitySkills,
    })
  }
}
