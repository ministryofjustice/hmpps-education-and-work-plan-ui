import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InPrisonWorkForm } from 'inductionForms'
import InPrisonWorkController from '../common/inPrisonWorkController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateInPrisonWorkForm from '../../validators/induction/inPrisonWorkFormValidator'
import { asArray } from '../../../utils/utils'
import { getPreviousPage } from '../../pageFlowHistory'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

export default class InPrisonWorkCreateController extends InPrisonWorkController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory, inductionDto } = req.session
    let previousPage = pageFlowHistory && getPreviousPage(pageFlowHistory)
    if (!previousPage) {
      previousPage =
        inductionDto.workOnRelease.hopingToWork === HopingToGetWorkValue.YES
          ? `/prisoners/${prisonNumber}/create-induction/affect-ability-to-work` // Long question set induction
          : `/prisoners/${prisonNumber}/create-induction/personal-interests` // Short question set induction
    }
    return previousPage
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitInPrisonWorkForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    const inPrisonWorkForm: InPrisonWorkForm = {
      inPrisonWork: asArray(req.body.inPrisonWork),
      inPrisonWorkOther: req.body.inPrisonWorkOther,
    }

    const errors = validateInPrisonWorkForm(inPrisonWorkForm, prisonerSummary)
    if (errors.length > 0) {
      req.session.inPrisonWorkForm = inPrisonWorkForm
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/in-prison-work`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonWork(inductionDto, inPrisonWorkForm)
    req.session.inductionDto = updatedInduction

    return this.previousPageWasCheckYourAnswers(req)
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/in-prison-training`)
  }
}
