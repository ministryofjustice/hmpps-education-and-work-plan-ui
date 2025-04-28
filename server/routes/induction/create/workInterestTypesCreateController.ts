import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkInterestTypesForm } from 'inductionForms'
import WorkInterestTypesController from '../common/workInterestTypesController'
import validateWorkInterestTypesForm from '../../validators/induction/workInterestTypesFormValidator'
import { asArray } from '../../../utils/utils'

export default class WorkInterestTypesCreateController extends WorkInterestTypesController {
  submitWorkInterestTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals

    const workInterestTypesForm: WorkInterestTypesForm = {
      workInterestTypes: asArray(req.body.workInterestTypes),
      workInterestTypesOther: req.body.workInterestTypesOther,
    }
    req.session.workInterestTypesForm = workInterestTypesForm

    const errors = validateWorkInterestTypesForm(workInterestTypesForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/work-interest-types`,
        errors,
      )
    }

    const updatedInduction = this.updatedInductionDtoWithWorkInterestTypes(inductionDto, workInterestTypesForm)
    req.journeyData.inductionDto = updatedInduction
    req.session.workInterestTypesForm = undefined

    return this.previousPageWasCheckYourAnswers(req)
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`)
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/work-interest-roles`)
  }
}
