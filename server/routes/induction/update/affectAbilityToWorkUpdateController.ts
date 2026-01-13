import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import AffectAbilityToWorkController from '../common/affectAbilityToWorkController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import { asArray } from '../../../utils/utils'
import { Result } from '../../../utils/result/result'
import { setRedirectPendingFlag } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Controller for the Update of the Factors Affecting a Prisoner's Ability To Work screen of the Induction.
 */
export default class AffectAbilityToWorkUpdateController extends AffectAbilityToWorkController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitAffectAbilityToWorkForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const affectAbilityToWorkForm: AffectAbilityToWorkForm = {
      affectAbilityToWork: asArray(req.body.affectAbilityToWork),
      affectAbilityToWorkOther: req.body.affectAbilityToWorkOther,
    }

    const updatedInduction = this.updatedInductionDtoWithAffectAbilityToWork(inductionDto, affectAbilityToWorkForm)

    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('affect-ability-to-work')
    }

    req.journeyData.inductionDto = undefined
    setRedirectPendingFlag(req)
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }
}
