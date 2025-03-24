import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkInterestRolesForm } from 'inductionForms'
import WorkInterestRolesController from '../common/workInterestRolesController'
import validateWorkInterestRolesForm from '../../validators/induction/workInterestRolesFormValidator'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class WorkInterestRolesCreateController extends WorkInterestRolesController {
  submitWorkInterestRolesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const workInterestRolesForm: WorkInterestRolesForm = {
      workInterestRoles: Object.entries<string>({ ...req.body.workInterestRoles }) as [WorkInterestTypeValue, string][],
      workInterestTypesOther: req.body.workInterestTypesOther,
    }
    getPrisonerContext(req.session, prisonNumber).workInterestRolesForm = workInterestRolesForm

    const errors = validateWorkInterestRolesForm(workInterestRolesForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/work-interest-roles`, errors)
    }

    getPrisonerContext(req.session, prisonNumber).inductionDto = this.updatedInductionDtoWithWorkInterestRoles(
      inductionDto,
      workInterestRolesForm,
    )
    getPrisonerContext(req.session, prisonNumber).workInterestRolesForm = undefined

    const nextPage = this.checkYourAnswersIsTheFirstPageInThePageHistory(req)
      ? `/prisoners/${prisonNumber}/create-induction/check-your-answers`
      : `/prisoners/${prisonNumber}/create-induction/affect-ability-to-work`
    return res.redirect(nextPage)
  }
}
