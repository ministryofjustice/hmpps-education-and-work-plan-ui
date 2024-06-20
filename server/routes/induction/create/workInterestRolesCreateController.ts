import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkInterestRolesForm } from 'inductionForms'
import WorkInterestRolesController from '../common/workInterestRolesController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import { getPreviousPage } from '../../pageFlowHistory'

export default class WorkInterestRolesCreateController extends WorkInterestRolesController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) ||
      `/prisoners/${prisonNumber}/create-induction/work-interest-types`
    return previousPage
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

    const nextPage = this.checkYourAnswersIsInThePageHistory(req)
      ? `/prisoners/${prisonNumber}/create-induction/check-your-answers`
      : `/prisoners/${prisonNumber}/create-induction/affect-ability-to-work`
    return res.redirect(nextPage)
  }
}
