import { NextFunction, Request, RequestHandler, Response } from 'express'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateHighestLevelOfEducationForm from '../../validators/induction/highestLevelOfEducationFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

export default class HighestLevelOfEducationCreateController extends HighestLevelOfEducationController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory, inductionDto } = req.session
    let previousPage = pageFlowHistory && getPreviousPage(pageFlowHistory)
    if (!previousPage) {
      // No previous page from the Page Flow History
      // The previous page in this case is based on whether it's a short or long question set induction
      previousPage =
        inductionDto.workOnRelease.hopingToWork === HopingToGetWorkValue.YES
          ? `/prisoners/${prisonNumber}/create-induction/work-interest-roles` // Previous page in Long question set
          : `/prisoners/${prisonNumber}/create-induction/reasons-not-to-get-work` // Previous page in Short question set
    }
    return previousPage
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

    const nextPage = this.previousPageWasCheckYourAnswers(req)
      ? `/prisoners/${prisonNumber}/create-induction/check-your-answers`
      : `/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`
    return res.redirect(nextPage)
  }
}
