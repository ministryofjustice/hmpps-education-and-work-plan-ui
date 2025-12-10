import { NextFunction, Request, RequestHandler, Response } from 'express'
import HopingToWorkOnReleaseController from '../common/hopingToWorkOnReleaseController'
import { InductionService } from '../../../services'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { Result } from '../../../utils/result/result'

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
      return res.redirect(`/prisoners/${prisonNumber}/induction/${journeyId}/work-interest-types`)
    }

    // Else we can simply call the API to update the Induction and return to Work & Interests tab
    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('hoping-to-work-on-release')
    }

    req.journeyData.inductionDto = undefined
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }
}
