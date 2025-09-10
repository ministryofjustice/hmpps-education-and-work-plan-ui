import { RequestHandler } from 'express'

export default class FunctionalSkillsController {
  getFunctionalSkillsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, prisonNamesById, prisonerFunctionalSkills } = res.locals

    res.render('pages/functionalSkills/index', {
      prisonerSummary,
      prisonNamesById,
      prisonerFunctionalSkills,
    })
  }
}
