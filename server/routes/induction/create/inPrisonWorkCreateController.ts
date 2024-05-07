import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InPrisonWorkForm } from 'inductionForms'
import InPrisonWorkController from '../common/inPrisonWorkController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateInPrisonWorkForm from '../../validators/induction/inPrisonWorkFormValidator'
import { asArray } from '../../../utils/utils'

export default class InPrisonWorkCreateController extends InPrisonWorkController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-induction/additional-training`
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
      req.flash('errors', errors)
      req.session.inPrisonWorkForm = inPrisonWorkForm
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/in-prison-work`)
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonWork(inductionDto, inPrisonWorkForm)
    req.session.inductionDto = updatedInduction

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/in-prison-training`)
  }
}
