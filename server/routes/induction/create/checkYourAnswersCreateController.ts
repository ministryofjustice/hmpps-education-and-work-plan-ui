import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import CheckYourAnswersController from '../common/checkYourAnswersController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'

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

    try {
      await this.inductionService.createInduction(prisonNumber, createInductionDto, req.user.username)
      req.session.pageFlowHistory = undefined
      req.journeyData.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/induction-created`)
    } catch (e) {
      logger.error(`Error creating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error creating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
