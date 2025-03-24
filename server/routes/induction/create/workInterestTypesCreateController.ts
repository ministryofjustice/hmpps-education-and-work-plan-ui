import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkInterestTypesForm } from 'inductionForms'
import WorkInterestTypesController from '../common/workInterestTypesController'
import validateWorkInterestTypesForm from '../../validators/induction/workInterestTypesFormValidator'
import { asArray } from '../../../utils/utils'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class WorkInterestTypesCreateController extends WorkInterestTypesController {
  submitWorkInterestTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const workInterestTypesForm: WorkInterestTypesForm = {
      workInterestTypes: asArray(req.body.workInterestTypes),
      workInterestTypesOther: req.body.workInterestTypesOther,
    }
    getPrisonerContext(req.session, prisonNumber).workInterestTypesForm = workInterestTypesForm

    const errors = validateWorkInterestTypesForm(workInterestTypesForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/work-interest-types`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithWorkInterestTypes(inductionDto, workInterestTypesForm)
    getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInduction
    getPrisonerContext(req.session, prisonNumber).workInterestTypesForm = undefined

    return this.previousPageWasCheckYourAnswers(req)
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/work-interest-roles`)
  }
}
