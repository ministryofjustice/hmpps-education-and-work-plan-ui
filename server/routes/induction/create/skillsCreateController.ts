import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { SkillsForm } from 'inductionForms'
import SkillsController from '../common/skillsController'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import validateSkillsForm from '../../validators/induction/skillsFormValidator'
import { asArray } from '../../../utils/utils'
import { getPreviousPage } from '../../pageFlowHistory'

export default class SkillsCreateController extends SkillsController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) ||
      `/prisoners/${prisonNumber}/create-induction/has-worked-before`
    return previousPage
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitSkillsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

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
