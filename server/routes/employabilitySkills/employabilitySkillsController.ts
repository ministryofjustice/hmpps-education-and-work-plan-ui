import { RequestHandler } from 'express'

export default class EmployabilitySkillsController {
  getEmployabilitySkillRatingsView: RequestHandler = async (req, res): Promise<void> => {
    const { prisonerSummary } = res.locals
    const { skillType } = req.params

    res.render('pages/employabilitySkills/employability-skill-ratings.njk', {
      prisonerSummary,
      skillType,
    })
  }
}
