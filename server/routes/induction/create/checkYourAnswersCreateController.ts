import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import CheckYourAnswersController from '../common/checkYourAnswersController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class CheckYourAnswersCreateController extends CheckYourAnswersController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitCheckYourAnswers: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    if (!inductionDto) {
      logger.debug(`RR-1300 - InductionDto for ${prisonNumber} was not retrieved from the session`)
    } else {
      logger.debug(`RR-1300 - InductionDto for ${prisonNumber} retrieved from the session successfully`)
      if (!inductionDto.workOnRelease) {
        logger.debug(
          `RR-1300 - Retrieved InductionDto is missing at least the workOnRelease property: ${JSON.stringify(inductionDto)}`,
        )
      }
    }

    const createInductionDto = toCreateOrUpdateInductionDto(prisonId, inductionDto)

    try {
      logger.debug(`RR-1300 - Calling API to create ${prisonNumber}'s induction`)
      await this.inductionService.createInduction(prisonNumber, createInductionDto, req.user.username)
      logger.debug(`RR-1300 - ${prisonNumber}'s induction created`)

      req.session.pageFlowHistory = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/induction-created`)
    } catch (e) {
      logger.error(`Error creating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error creating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
