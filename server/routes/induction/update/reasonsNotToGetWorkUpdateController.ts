import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InductionDto } from 'inductionDto'
import type { ReasonsNotToGetWorkForm } from 'inductionForms'
import ReasonsNotToGetWorkController from '../common/reasonsNotToGetWorkController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateReasonsNotToGetWorkForm from './reasonsNotToGetWorkFormValidator'

/**
 * Controller for Updating a Prisoner's Reasons Not To Get Work after release screen of the Induction.
 */
export default class ReasonsNotToGetWorkUpdateController extends ReasonsNotToGetWorkController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(_req: Request): string {
    return 'Back to <TODO - check what CIAG UI does here>'
  }

  submitReasonsNotToGetWorkForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.reasonsNotToGetWorkForm = { ...req.body }
    if (!req.session.reasonsNotToGetWorkForm.reasonsNotToGetWork) {
      req.session.reasonsNotToGetWorkForm.reasonsNotToGetWork = []
    }
    if (!Array.isArray(req.session.reasonsNotToGetWorkForm.reasonsNotToGetWork)) {
      req.session.reasonsNotToGetWorkForm.reasonsNotToGetWork = [
        req.session.reasonsNotToGetWorkForm.reasonsNotToGetWork,
      ]
    }
    const { reasonsNotToGetWorkForm } = req.session

    const errors = validateReasonsNotToGetWorkForm(reasonsNotToGetWorkForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`)
    }

    const updatedInduction = this.updatedInductionDtoWithReasonsNotToGetWork(inductionDto, reasonsNotToGetWorkForm)
    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

    try {
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.reasonsNotToGetWorkForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  private updatedInductionDtoWithReasonsNotToGetWork(
    inductionDto: InductionDto,
    reasonsNotToGetWorkForm: ReasonsNotToGetWorkForm,
  ): InductionDto {
    return {
      ...inductionDto,
      workOnRelease: {
        ...inductionDto.workOnRelease,
        notHopingToWorkReasons: reasonsNotToGetWorkForm.reasonsNotToGetWork,
        notHopingToWorkOtherReason: reasonsNotToGetWorkForm.reasonsNotToGetWorkOther,
      },
    }
  }
}
