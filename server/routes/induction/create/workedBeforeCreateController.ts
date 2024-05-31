import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkedBeforeForm } from 'inductionForms'
import type { InductionDto } from 'inductionDto'
import WorkedBeforeController from '../common/workedBeforeController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateWorkedBeforeForm from '../../validators/induction/workedBeforeFormValidator'
import YesNoValue from '../../../enums/yesNoValue'
import { getPreviousPage } from '../../pageFlowHistory'

export default class WorkedBeforeCreateController extends WorkedBeforeController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) ||
      `/prisoners/${prisonNumber}/create-induction/additional-training`
    return previousPage
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitWorkedBeforeForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    const workedBeforeForm: WorkedBeforeForm = { ...req.body }
    req.session.workedBeforeForm = workedBeforeForm

    const errors = validateWorkedBeforeForm(workedBeforeForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/has-worked-before`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithHasWorkedBefore(inductionDto, workedBeforeForm)
    const prisonerHasWorkedBefore = updatedInduction.previousWorkExperiences.hasWorkedBefore
    req.session.inductionDto = updatedInduction
    req.session.workedBeforeForm = undefined

    if (!this.previousPageWasCheckYourAnswers(req)) {
      if (prisonerHasWorkedBefore) {
        return res.redirect(`/prisoners/${prisonNumber}/create-induction/previous-work-experience`)
      }

      // Prisoner has not worked before; skip straight to Personal Skills
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/skills`)
    }

    if (!prisonerHasWorkedBefore) {
      // Previous page was Check Your Answers and prisoner has not worked before
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    // Previous page was Check Your Answers and prisoner has worked before - we need to ask about previous work experience
    return res.redirect(`/prisoners/${prisonNumber}/create-induction/previous-work-experience`)
  }

  updatedInductionDtoWithHasWorkedBefore(inductionDto: InductionDto, workedBeforeForm: WorkedBeforeForm): InductionDto {
    const updatedInduction = super.updatedInductionDtoWithHasWorkedBefore(inductionDto, workedBeforeForm)

    // If the prisoner has worked before return the updated induction
    if (workedBeforeForm.hasWorkedBefore === YesNoValue.YES) {
      return updatedInduction
    }

    // If the prisoner has not worked before remove any previous worked experiences from the induction - this caters for the
    // user clicking the Change link on Check Your Answers and changing the answer from Yes to No
    return {
      ...updatedInduction,
      previousWorkExperiences: {
        ...updatedInduction.previousWorkExperiences,
        experiences: [],
      },
    }
  }
}
