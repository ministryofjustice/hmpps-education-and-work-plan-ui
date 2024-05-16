import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import PreviousWorkExperienceDetailController from '../common/previousWorkExperienceDetailController'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import validatePreviousWorkExperienceDetailForm from '../../validators/induction/previousWorkExperienceDetailFormValidator'
import { getNextPage, isLastPage } from '../../pageFlowQueue'

export default class PreviousWorkExperienceDetailCreateController extends PreviousWorkExperienceDetailController {
  getBackLinkUrl(req: Request): string {
    const { pageFlowHistory } = req.session
    return getPreviousPage(pageFlowHistory)
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitPreviousWorkExperienceDetailForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { typeOfWorkExperience } = req.params

    let previousWorkExperienceType: TypeOfWorkExperienceValue
    try {
      previousWorkExperienceType = this.validateInductionContainsPreviousWorkExperienceOfType({
        req,
        inductionDto: inductionDto as InductionDto,
        invalidTypeOfWorkExperienceMessage: `Attempt to submit PreviousWorkExperienceDetailForm for invalid work experience type ${typeOfWorkExperience} from ${prisonerSummary.prisonNumber}'s Induction`,
        typeOfWorkExperienceMissingOnInductionMessage: `Attempt to submit PreviousWorkExperienceDetailForm for work experience type ${typeOfWorkExperience} that does not exist on ${prisonerSummary.prisonNumber}'s Induction`,
      })
    } catch (error) {
      return next(createError(404, `Previous Work Experience type ${typeOfWorkExperience} not found on Induction`))
    }

    req.session.previousWorkExperienceDetailForm = { ...req.body }
    const { previousWorkExperienceDetailForm } = req.session

    const errors = validatePreviousWorkExperienceDetailForm(previousWorkExperienceDetailForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(
        `/prisoners/${prisonNumber}/create-induction/previous-work-experience/${typeOfWorkExperience}`,
        errors,
      )
    }

    const updatedInduction = this.updatedInductionDtoWithPreviousWorkExperienceDetail(
      inductionDto,
      previousWorkExperienceDetailForm,
      previousWorkExperienceType,
    )
    req.session.inductionDto = updatedInduction
    req.session.previousWorkExperienceDetailForm = undefined

    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    const { pageFlowQueue } = req.session
    if (!isLastPage(pageFlowQueue)) {
      // We are not on the last page of the queue yet - redirect to the next page in the queue
      return res.redirect(getNextPage(pageFlowQueue))
    }

    // We are at the end of the page flow queue. Tidy up by removing both the page flow queue
    req.session.pageFlowQueue = undefined

    const userHasComeFromCheckYourAnswers = this.checkYourAnswersIsTheFirstPageInThePageHistory(req)
    if (userHasComeFromCheckYourAnswers) {
      // If the page flow history started with Check Your Answers then we need to redirect the user back to there now that they have been to every page on the queue
      req.session.pageFlowHistory = undefined
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    // Otherwise redirect to next page in the question set (post-release work interests)
    req.session.pageFlowHistory = undefined
    return res.redirect(`/prisoners/${prisonNumber}/create-induction/work-interest-types`)
  }
}
