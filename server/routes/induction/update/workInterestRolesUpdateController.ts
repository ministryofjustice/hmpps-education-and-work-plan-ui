import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkInterestRolesForm } from 'inductionForms'
import WorkInterestRolesController from '../common/workInterestRolesController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import { Result } from '../../../utils/result/result'

/**
 * Controller for updating a Prisoner's Future Work Interest Roles part of an Induction.
 */
export default class WorkInterestRolesUpdateController extends WorkInterestRolesController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitWorkInterestRolesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const workInterestRoles = Object.entries<string>({ ...req.body.workInterestRoles }) as [
      WorkInterestTypeValue,
      string,
    ][]
    const workInterestRolesForm: WorkInterestRolesForm = { ...req.body, workInterestRoles }

    const updatedInduction = this.updatedInductionDtoWithWorkInterestRoles(inductionDto, workInterestRolesForm)
    req.journeyData.inductionDto = updatedInduction

    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('work-interest-roles')
    }

    req.journeyData.inductionDto = undefined
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }
}
