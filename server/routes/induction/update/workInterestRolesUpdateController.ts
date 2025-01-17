import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { WorkInterestRolesForm } from 'inductionForms'
import WorkInterestRolesController from '../common/workInterestRolesController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import validateWorkInterestRolesForm from '../../validators/induction/workInterestRolesFormValidator'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'

/**
 * Controller for updating a Prisoner's Future Work Interest Roles part of an Induction.
 */
export default class WorkInterestRolesUpdateController extends WorkInterestRolesController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) || `/plan/${prisonNumber}/view/work-and-interests`
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
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const workInterestRoles = Object.entries<string>({ ...req.body.workInterestRoles }) as [
      WorkInterestTypeValue,
      string,
    ][]
    const workInterestRolesForm: WorkInterestRolesForm = { ...req.body, workInterestRoles }
    req.session.workInterestRolesForm = workInterestRolesForm

    const errors = validateWorkInterestRolesForm(workInterestRolesForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/work-interest-roles`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithWorkInterestRoles(inductionDto, workInterestRolesForm)
    req.session.inductionDto = updatedInduction

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username)

      req.session.workInterestRolesForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
