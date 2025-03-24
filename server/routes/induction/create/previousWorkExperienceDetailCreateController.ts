import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { PreviousWorkExperienceDetailForm } from 'inductionForms'
import PreviousWorkExperienceDetailController from '../common/previousWorkExperienceDetailController'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import validatePreviousWorkExperienceDetailForm from '../../validators/induction/previousWorkExperienceDetailFormValidator'
import { getNextPage, isLastPage } from '../../pageFlowQueue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class PreviousWorkExperienceDetailCreateController extends PreviousWorkExperienceDetailController {
  submitPreviousWorkExperienceDetailForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { typeOfWorkExperience } = req.params
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    let previousWorkExperienceType: TypeOfWorkExperienceValue
    try {
      previousWorkExperienceType = this.validateInductionContainsPreviousWorkExperienceOfType({
        req,
        inductionDto: inductionDto as InductionDto,
        invalidTypeOfWorkExperienceMessage: `Attempt to submit PreviousWorkExperienceDetailForm for invalid work experience type ${typeOfWorkExperience} from ${prisonerSummary.prisonNumber}'s Induction`,
        typeOfWorkExperienceMissingOnInductionMessage: `Attempt to submit PreviousWorkExperienceDetailForm for work experience type ${typeOfWorkExperience} that does not exist on ${prisonerSummary.prisonNumber}'s Induction`,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(createError(404, `Previous Work Experience type ${typeOfWorkExperience} not found on Induction`))
    }

    const previousWorkExperienceDetailForm: PreviousWorkExperienceDetailForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).previousWorkExperienceDetailForm = previousWorkExperienceDetailForm

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
    getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInduction
    getPrisonerContext(req.session, prisonNumber).previousWorkExperienceDetailForm = undefined

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

    const nextPage = this.checkYourAnswersIsTheFirstPageInThePageHistory(req)
      ? `/prisoners/${prisonNumber}/create-induction/check-your-answers`
      : `/prisoners/${prisonNumber}/create-induction/skills`

    req.session.pageFlowHistory = undefined
    return res.redirect(nextPage)
  }
}
