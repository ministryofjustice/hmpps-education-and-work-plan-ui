import { NextFunction, Request, RequestHandler, Response } from 'express'
import CheckYourAnswersController from '../common/checkYourAnswersController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import { Result } from '../../../utils/result/result'
import { setRedirectPendingFlag } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

export default class CheckYourAnswersCreateController extends CheckYourAnswersController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitCheckYourAnswers: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const createInductionDto = toCreateOrUpdateInductionDto(prisonId, inductionDto)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.inductionService.createInduction(prisonNumber, createInductionDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error creating Induction for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('check-your-answers')
    }

    req.journeyData.inductionDto = undefined
    setRedirectPendingFlag(req)
    return res.redirect(`/plan/${prisonNumber}/induction-created`)
  }
}
