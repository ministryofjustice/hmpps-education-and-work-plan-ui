import { NextFunction, Request, RequestHandler, Response } from 'express'
import EmployabilitySkillsService from '../../services/employabilitySkillsService'
import { Result } from '../../utils/result/result'

/**
 *  Middleware function that returns a Request handler function to retrieve the Employability Skills from EmployabilitySkillsService and store in res.locals
 */
const retrieveEmployabilitySkills = (employabilitySkillsService: EmployabilitySkillsService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { username } = req.user

    // Lookup the prisoner's Employability Skills and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.employabilitySkills = await Result.wrap(
      employabilitySkillsService.getEmployabilitySkills(username, prisonNumber),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveEmployabilitySkills
