import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { SkillsForm } from 'inductionForms'
import SkillsController from '../common/skillsController'
import validateSkillsForm from '../../validators/induction/skillsFormValidator'
import { asArray } from '../../../utils/utils'

export default class SkillsCreateController extends SkillsController {
  submitSkillsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals

    const skillsForm: SkillsForm = {
      skills: asArray(req.body.skills),
      skillsOther: req.body.skillsOther,
    }
    req.session.skillsForm = skillsForm

    const errors = validateSkillsForm(skillsForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/skills`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithSkills(inductionDto, skillsForm)
    req.session.inductionDto = updatedInduction
    req.session.skillsForm = undefined

    return this.previousPageWasCheckYourAnswers(req)
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/personal-interests`)
  }
}
