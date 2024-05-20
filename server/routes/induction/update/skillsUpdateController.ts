import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { SkillsForm } from 'inductionForms'
import SkillsController from '../common/skillsController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateSkillsForm from '../../validators/induction/skillsFormValidator'
import { buildNewPageFlowHistory, getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import { asArray } from '../../../utils/utils'

/**
 * Controller for the Update of the Skills screen of the Induction.
 */
export default class SkillsUpdateController extends SkillsController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitSkillsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    const skillsForm: SkillsForm = {
      skills: asArray(req.body.skills),
      skillsOther: req.body.skillsOther,
    }
    req.session.skillsForm = skillsForm

    const errors = validateSkillsForm(skillsForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/skills`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithSkills(inductionDto, skillsForm)

    // If the previous page was Check Your Answers, decide whether to redirect back check answers on submission
    if (this.previousPageWasCheckYourAnswers(req)) {
      req.session.inductionDto = updatedInduction
      return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
    }

    if (req.session.updateInductionQuestionSet) {
      req.session.inductionDto = updatedInduction
      const nextPage = `/prisoners/${prisonNumber}/induction/personal-interests`
      req.session.pageFlowHistory = buildNewPageFlowHistory(req)
      req.session.skillsForm = undefined
      return res.redirect(nextPage)
    }

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.skillsForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
