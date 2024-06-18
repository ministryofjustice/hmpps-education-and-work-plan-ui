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

    // If the previous page was Check Your Answers and the user has not changed the answer, go back to Check Your Answers
    if (this.previousPageWasCheckYourAnswers(req) && answerHasNotBeenChanged(inductionDto, hopingToWorkOnReleaseForm)) {
      res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    const updatedInduction = this.updatedInductionDtoWithHopingToWorkOnRelease(inductionDto, hopingToWorkOnReleaseForm)
    req.session.inductionDto = updatedInduction
    req.session.hopingToWorkOnReleaseForm = undefined

    let nextPage: string
    if (this.previousPageWasCheckYourAnswers(req)) {
      // If the previous page was Check Your Answers we either need to go back there in the case the prisoner does not want to work
      // or go to Work Interest Types in order to capture the prisoners future work interests.
      nextPage =
        updatedInduction.workOnRelease.hopingToWork !== YesNoValue.YES
          ? `/prisoners/${prisonNumber}/create-induction/check-your-answers`
          : `/prisoners/${prisonNumber}/create-induction/work-interest-types`
    } else {
      // The previous page was not Check Your Answers so we are part of the regular Create journey. Depending on whether
      // the prisoner wants to work or not the next page is either Work Interest Types or Affect Ability To Work.
      nextPage =
        updatedInduction.workOnRelease.hopingToWork === YesNoValue.YES
          ? `/prisoners/${prisonNumber}/create-induction/work-interest-types`
          : `/prisoners/${prisonNumber}/create-induction/affect-ability-to-work`
    }
    return res.redirect(nextPage)
  }
}

const answerHasNotBeenChanged = (
  originalInduction: InductionDto,
  hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm,
): boolean => originalInduction.workOnRelease.hopingToWork === hopingToWorkOnReleaseForm.hopingToGetWork
