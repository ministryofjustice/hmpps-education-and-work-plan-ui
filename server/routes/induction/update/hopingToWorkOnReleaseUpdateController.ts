import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import HopingToWorkOnReleaseController from '../common/hopingToWorkOnReleaseController'
import validateHopingToWorkOnReleaseForm from '../../validators/induction/hopingToWorkOnReleaseFormValidator'
import { InductionService } from '../../../services'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { buildNewPageFlowHistory } from '../../pageFlowHistory'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class HopingToWorkOnReleaseUpdateController extends HopingToWorkOnReleaseController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitHopingToWorkOnReleaseForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm = hopingToWorkOnReleaseForm

    const errors = validateHopingToWorkOnReleaseForm(hopingToWorkOnReleaseForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`, errors)
    }

    // If the user has not changed the answer, go back to Work & Interests
    if (this.answerHasNotBeenChanged(inductionDto, hopingToWorkOnReleaseForm)) {
      getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    }

    const updatedInduction = this.updatedInductionDtoWithHopingToWorkOnRelease(inductionDto, hopingToWorkOnReleaseForm)
    getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInduction

    // If the new answer for Hoping To Work On Release is YES then we need to go to Work Interest Types in order to capture the prisoners future work interests.
    if (hopingToWorkOnReleaseForm.hopingToGetWork === HopingToGetWorkValue.YES) {
      req.session.pageFlowHistory = buildNewPageFlowHistory(req)
      return res.redirect(`/prisoners/${prisonNumber}/induction/work-interest-types`)
    }

    // Else we can simply call the API to update the Induction and return to Work & Interests tab
    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }

    getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm = undefined
    getPrisonerContext(req.session, prisonNumber).inductionDto = undefined
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }
}
