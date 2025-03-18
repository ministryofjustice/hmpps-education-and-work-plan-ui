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
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    if (!inductionDto) {
      logger.debug(`InductionDto for ${prisonNumber} was not retrieved from the session`)
    } else {
      logger.debug(`InductionDto for ${prisonNumber} retrieved from the session successfully`)
      if (!inductionDto.workOnRelease) {
        logger.debug(
          `Retrieved InductionDto is missing at least the workOnRelease property: ${JSON.stringify(inductionDto)}`,
        )
      }
    }

    const createInductionDto = toCreateOrUpdateInductionDto(prisonId, inductionDto)

    try {
      logger.debug(`Calling API to create ${prisonNumber}'s induction`)
      await this.inductionService.createInduction(prisonNumber, createInductionDto, req.user.username)
      logger.debug(`${prisonNumber}'s induction created`)

      req.session.pageFlowHistory = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/induction-created`)
    } catch (e) {
      logger.error(`Error creating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error creating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
