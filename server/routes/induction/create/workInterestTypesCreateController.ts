import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkInterestTypesForm } from 'inductionForms'
import WorkInterestTypesController from '../common/workInterestTypesController'
import { asArray } from '../../../utils/utils'

export default class WorkInterestTypesCreateController extends WorkInterestTypesController {
  submitWorkInterestTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { inductionDto } = req.journeyData

    const workInterestTypesForm: WorkInterestTypesForm = {
      workInterestTypes: asArray(req.body.workInterestTypes),
      workInterestTypesOther: req.body.workInterestTypesOther,
    }

    const updatedInduction = this.updatedInductionDtoWithWorkInterestTypes(inductionDto, workInterestTypesForm)
    req.journeyData.inductionDto = updatedInduction

    return res.redirect(req.query?.submitToCheckAnswers === 'true' ? 'check-your-answers' : 'work-interest-roles')
  }
}
