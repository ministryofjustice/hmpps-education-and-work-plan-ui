import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import { InductionService } from '../../../services'
import PreviousWorkExperienceDetailController from '../common/previousWorkExperienceDetailController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import { getNextPage, isLastPage } from '../../pageFlowQueue'
import { Result } from '../../../utils/result/result'
import { setRedirectPendingFlag } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Controller for the Update of the Previous Work Experience Detail screen of the Induction.
 */

export default class PreviousWorkExperienceDetailUpdateController extends PreviousWorkExperienceDetailController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitPreviousWorkExperienceDetailForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary
    const { typeOfWorkExperience } = req.params

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

    const { pageFlowQueue } = req.session
    if (pageFlowQueue && !isLastPage(pageFlowQueue)) {
      // There is a page flow queue, and we are not on the last page of the queue yet
      // Put the updated InductionDto on the session and redirect to the next page in the queue
      req.journeyData.inductionDto = updatedInduction
      return res.redirect(getNextPage(pageFlowQueue))
    }

    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect(
        `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/${typeOfWorkExperience}`,
      )
    }

    req.journeyData.inductionDto = undefined
    setRedirectPendingFlag(req)
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }
}
