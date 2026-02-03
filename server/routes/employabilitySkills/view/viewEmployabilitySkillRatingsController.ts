import { RequestHandler } from 'express'

export default class ViewEmployabilitySkillRatingsController {
  getEmployabilitySkillRatingsView: RequestHandler = async (req, res): Promise<void> => {
    const { prisonerSummary } = res.locals
    const { skillType } = req.params

    res.render('pages/employabilitySkills/view/employability-skill-ratings.njk', {
      prisonerSummary,
      skillType,
    })
  }
}
