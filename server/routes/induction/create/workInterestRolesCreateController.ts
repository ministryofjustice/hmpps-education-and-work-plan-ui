import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkInterestRolesForm } from 'inductionForms'
import WorkInterestRolesController from '../common/workInterestRolesController'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'

export default class WorkInterestRolesCreateController extends WorkInterestRolesController {
  submitWorkInterestRolesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData

    const workInterestRoles = Object.entries<string>({ ...req.body.workInterestRoles }) as [
      WorkInterestTypeValue,
      string,
    ][]
    const workInterestRolesForm: WorkInterestRolesForm = { ...req.body, workInterestRoles }

    req.journeyData.inductionDto = this.updatedInductionDtoWithWorkInterestRoles(inductionDto, workInterestRolesForm)

    const nextPage = this.checkYourAnswersIsTheFirstPageInThePageHistory(req)
      ? `/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`
      : `/prisoners/${prisonNumber}/create-induction/${journeyId}/affect-ability-to-work`
    return res.redirect(nextPage)
  }
}
