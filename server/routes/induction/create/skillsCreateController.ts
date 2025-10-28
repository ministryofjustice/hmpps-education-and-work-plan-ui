import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { SkillsForm } from 'inductionForms'
import SkillsController from '../common/skillsController'
import { asArray } from '../../../utils/utils'

export default class SkillsCreateController extends SkillsController {
  submitSkillsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData

    const skillsForm: SkillsForm = {
      skills: asArray(req.body.skills),
      skillsOther: req.body.skillsOther,
    }

    const updatedInduction = this.updatedInductionDtoWithSkills(inductionDto, skillsForm)
    req.journeyData.inductionDto = updatedInduction

    return res.redirect(
      req.query?.submitToCheckAnswers === 'true'
        ? `/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`
        : `/prisoners/${prisonNumber}/create-induction/${journeyId}/personal-interests`,
    )
  }
}
