import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import HopingToWorkOnReleaseController from '../common/hopingToWorkOnReleaseController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateHopingToWorkOnReleaseForm from '../../validators/induction/hopingToWorkOnReleaseFormValidator'
import YesNoValue from '../../../enums/yesNoValue'

export default class HopingToWorkOnReleaseCreateController extends HopingToWorkOnReleaseController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/overview`
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

    // A change to "Hoping to work on release" on a new Induction via the Change link on Check Your Answers will
    // result in a new question set being asked. To correctly handle the flow and back links in subsequent pages
    // we need to set the updateInductionQuestionSet flag
    if (this.changeWillResultInANewQuestionSet(inductionDto, hopingToWorkOnReleaseForm)) {
      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: hopingToWorkOnReleaseForm.hopingToGetWork }
    }

    if (updatedInduction.workOnRelease.hopingToWork === YesNoValue.YES) {
      // Long question set Induction
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/work-interest-types`)
    }
    // Short question set Induction
    return res.redirect(`/prisoners/${prisonNumber}/create-induction/reasons-not-to-get-work`)
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
