import { RequestHandler } from 'express'
import { formatEmployabilitySkillsFilter } from '../../../filters/formatEmployabilitySkillsFilter'
import EmployabilitySkillsValue from '../../../enums/employabilitySkillsValue'

export default class AddEmployabilitySkillRatingsController {
  getEmployabilitySkillRatingsView: RequestHandler = async (req, res): Promise<void> => {
    const { prisonerSummary } = res.locals
    const { skillType } = req.params

    res.render('pages/employabilitySkills/add/employability-skill-ratings.njk', {
      prisonerSummary,
      skillType,
    })
  }

  submitEmployabilitySkillRatingsForm: RequestHandler = async (req, res): Promise<void> => {
    const { prisonNumber } = req.params
    const skillType = req.params.skillType as EmployabilitySkillsValue

    return res.redirectWithSuccess(
      `/plan/${prisonNumber}/view/employability-skills`,
      `${formatEmployabilitySkillsFilter(skillType)} skill updated`,
    )
  }
}
