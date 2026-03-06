import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class EmployabilitySkillsCreateController {
  getEmployabilitySkillsView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary } = res.locals

    return res.render('pages/induction/employability-skills/index', { prisonerSummary })
  }

  submitEmployabilitySkillsView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params

    return res.redirect(
      req.query?.submitToCheckAnswers === 'true'
        ? `/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`
        : `/prisoners/${prisonNumber}/create-induction/${journeyId}/personal-interests`,
    )
  }
}
