import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkInterestRolesForm } from 'inductionForms'
import WorkInterestRolesController from '../common/workInterestRolesController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

export default class WorkInterestRolesCreateController extends WorkInterestRolesController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-induction/work-interest-types`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitWorkInterestRolesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.session

    const workInterestRoles = new Map(Object.entries({ ...req.body.workInterestRoles }))
    const workInterestRolesForm = { workInterestRoles } as WorkInterestRolesForm

    req.session.inductionDto = this.updatedInductionDtoWithWorkInterestRoles(inductionDto, workInterestRolesForm)

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/skills`)
  }
}
