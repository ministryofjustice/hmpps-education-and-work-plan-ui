import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import HopingToWorkOnReleaseController from '../common/hopingToWorkOnReleaseController'
import { InductionService } from '../../../services'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { buildNewPageFlowHistory } from '../../pageFlowHistory'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

export default class HopingToWorkOnReleaseUpdateController extends HopingToWorkOnReleaseController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitHopingToWorkOnReleaseForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const hopingToWorkOnReleaseForm = { ...req.body }

    // If the user has not changed the answer, go back to Work & Interests
    if (this.answerHasNotBeenChanged(inductionDto, hopingToWorkOnReleaseForm)) {
      req.journeyData.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    }

    const updatedInduction = this.updatedInductionDtoWithHopingToWorkOnRelease(inductionDto, hopingToWorkOnReleaseForm)
    req.journeyData.inductionDto = updatedInduction

    // If the new answer for Hoping To Work On Release is YES then we need to go to Work Interest Types in order to capture the prisoners future work interests.
    if (hopingToWorkOnReleaseForm.hopingToGetWork === HopingToGetWorkValue.YES) {
      req.session.pageFlowHistory = buildNewPageFlowHistory(req)
      return res.redirect(`/prisoners/${prisonNumber}/induction/${journeyId}/work-interest-types`)
    }

    // Else we can simply call the API to update the Induction and return to Work & Interests tab
    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }

    req.journeyData.inductionDto = undefined
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }
}
