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
    const { inductionDto } = req.journeyData

    const workInterestRoles = Object.entries<string>({ ...req.body.workInterestRoles }) as [
      WorkInterestTypeValue,
      string,
    ][]
    const workInterestRolesForm: WorkInterestRolesForm = { ...req.body, workInterestRoles }

    const nextPage =
      req.query?.submitToCheckAnswers === 'true' ||
      inductionDto.futureWorkInterests.needToCompleteJourneyFromCheckYourAnswers
        ? 'check-your-answers'
        : 'affect-ability-to-work'
    req.journeyData.inductionDto = this.updatedInductionDtoWithWorkInterestRoles(inductionDto, workInterestRolesForm)

    return res.redirect(nextPage)
  }
}
