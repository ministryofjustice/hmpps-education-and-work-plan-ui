import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkedBeforeForm } from 'inductionForms'
import WorkedBeforeController from '../common/workedBeforeController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'
import { Result } from '../../../utils/result/result'
import { setRedirectPendingFlag } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Controller for the Update of the Worked Before screen of the Induction.
 */
export default class WorkedBeforeUpdateController extends WorkedBeforeController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitWorkedBeforeForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const workedBeforeForm: WorkedBeforeForm = { ...req.body }

    const updatedInduction = this.updatedInductionDtoWithHasWorkedBefore(inductionDto, workedBeforeForm)
    const prisonerHasWorkedBefore =
      updatedInduction.previousWorkExperiences.hasWorkedBefore === HasWorkedBeforeValue.YES

    if (prisonerHasWorkedBefore) {
      req.journeyData.inductionDto = updatedInduction
      return res.redirect(`/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience`)
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
      return res.redirect('has-worked-before')
    }

    req.journeyData.inductionDto = undefined
    setRedirectPendingFlag(req)
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }
}
