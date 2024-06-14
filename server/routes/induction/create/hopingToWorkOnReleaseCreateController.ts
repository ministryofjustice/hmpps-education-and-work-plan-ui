import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import HopingToWorkOnReleaseController from '../common/hopingToWorkOnReleaseController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateHopingToWorkOnReleaseForm from '../../validators/induction/hopingToWorkOnReleaseFormValidator'
import YesNoValue from '../../../enums/yesNoValue'
import { getPreviousPage } from '../../pageFlowHistory'

export default class HopingToWorkOnReleaseCreateController extends HopingToWorkOnReleaseController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage = (pageFlowHistory && getPreviousPage(pageFlowHistory)) || `/plan/${prisonNumber}/view/overview`
    return previousPage
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitHopingToWorkOnReleaseForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    req.session.hopingToWorkOnReleaseForm = { ...req.body }
    const { hopingToWorkOnReleaseForm } = req.session

    const errors = validateHopingToWorkOnReleaseForm(hopingToWorkOnReleaseForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/hoping-to-work-on-release`, errors)
    }

    const updatedInduction = updatedInductionDtoWithHopingToWorkOnRelease(inductionDto, hopingToWorkOnReleaseForm)
    req.session.inductionDto = updatedInduction
    req.session.hopingToWorkOnReleaseForm = undefined

    const nextPage =
      updatedInduction.workOnRelease.hopingToWork === YesNoValue.YES
        ? `/prisoners/${prisonNumber}/create-induction/work-interest-types`
        : `/prisoners/${prisonNumber}/create-induction/affect-ability-to-work`
    return res.redirect(nextPage)
  }
}

const updatedInductionDtoWithHopingToWorkOnRelease = (
  inductionDto: InductionDto,
  hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm,
): InductionDto => {
  return {
    ...inductionDto,
    workOnRelease: {
      ...inductionDto.workOnRelease,
      hopingToWork: hopingToWorkOnReleaseForm.hopingToGetWork,
    },
  }
}
