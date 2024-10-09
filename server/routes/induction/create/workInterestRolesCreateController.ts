import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkInterestRolesForm } from 'inductionForms'
import WorkInterestRolesController from '../common/workInterestRolesController'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import { getPreviousPage } from '../../pageFlowHistory'
import validateWorkInterestRolesForm from '../../validators/induction/workInterestRolesFormValidator'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'

export default class WorkInterestRolesCreateController extends WorkInterestRolesController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) ||
      `/prisoners/${prisonNumber}/create-induction/work-interest-types`
    return previousPage
  }

  getBackLinkAriaText(req: Request, res: Response): string {
    return getDynamicBackLinkAriaText(req, res, this.getBackLinkUrl(req))
  }

  submitWorkInterestRolesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.session

    const workInterestRoles = Object.entries<string>({ ...req.body.workInterestRoles }) as [
      WorkInterestTypeValue,
      string,
    ][]
    const workInterestRolesForm: WorkInterestRolesForm = { ...req.body, workInterestRoles }
    req.session.workInterestRolesForm = workInterestRolesForm

    const errors = validateWorkInterestRolesForm(workInterestRolesForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/work-interest-roles`, errors)
    }

    req.session.inductionDto = this.updatedInductionDtoWithWorkInterestRoles(inductionDto, workInterestRolesForm)
    req.session.workInterestRolesForm = undefined

    const nextPage = this.checkYourAnswersIsInThePageHistory(req)
      ? `/prisoners/${prisonNumber}/create-induction/check-your-answers`
      : `/prisoners/${prisonNumber}/create-induction/affect-ability-to-work`
    return res.redirect(nextPage)
  }
}
