import { NextFunction, Request, RequestHandler, Response } from 'express'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateHighestLevelOfEducationForm from '../../validators/induction/highestLevelOfEducationFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'

export default class HighestLevelOfEducationCreateController extends HighestLevelOfEducationController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/prisoners/${prisonNumber}/create-induction/qualifications`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitHighestLevelOfEducationForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    req.session.highestLevelOfEducationForm = { ...req.body }
    const { highestLevelOfEducationForm } = req.session

    const errors = validateHighestLevelOfEducationForm(highestLevelOfEducationForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/highest-level-of-education`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithHighestLevelOfEducation(
      inductionDto,
      highestLevelOfEducationForm,
    )
    req.session.inductionDto = updatedInduction
    req.session.highestLevelOfEducationForm = undefined

    // If the previous page was Check Your Answers, forward to Check Your Answers again
    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    if (this.highestLevelOfEducationDoesNotRequireQualifications(highestLevelOfEducationForm)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/additional-training`)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/qualification-level`)
  }
}
