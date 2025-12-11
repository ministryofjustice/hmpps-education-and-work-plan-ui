import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import PreviousWorkExperienceDetailController from '../common/previousWorkExperienceDetailController'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import { getNextPage, isLastPage } from '../../pageFlowQueue'

export default class PreviousWorkExperienceDetailCreateController extends PreviousWorkExperienceDetailController {
  submitPreviousWorkExperienceDetailForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { typeOfWorkExperience } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals

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

    const previousWorkExperienceDetailForm = { ...req.body }

    const updatedInduction = this.updatedInductionDtoWithPreviousWorkExperienceDetail(
      inductionDto,
      previousWorkExperienceDetailForm,
      previousWorkExperienceType,
    )
    req.journeyData.inductionDto = updatedInduction

    const previousPageWasCheckYourAnswers = req.query?.submitToCheckAnswers === 'true'
    req.journeyData.inductionDto.previousWorkExperiences.needToCompleteJourneyFromCheckYourAnswers =
      req.journeyData.inductionDto.previousWorkExperiences.needToCompleteJourneyFromCheckYourAnswers ||
      previousPageWasCheckYourAnswers

    if (previousPageWasCheckYourAnswers) {
      return res.redirect('../check-your-answers')
    }

    const { pageFlowQueue } = req.session
    if (!isLastPage(pageFlowQueue)) {
      // We are not on the last page of the queue yet - redirect to the next page in the queue
      return res.redirect(getNextPage(pageFlowQueue))
    }

    // We are at the end of the page flow queue. Tidy up by removing both the page flow queue
    req.session.pageFlowQueue = undefined

    const nextPage = req.journeyData.inductionDto.previousWorkExperiences.needToCompleteJourneyFromCheckYourAnswers
      ? '../check-your-answers'
      : '../skills'

    return res.redirect(nextPage)
  }
}
