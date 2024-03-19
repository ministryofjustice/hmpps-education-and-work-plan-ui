import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InductionDto } from 'inductionDto'
import type { WorkInterestRolesForm } from 'inductionForms'
import WorkInterestRolesController from '../common/workInterestRolesController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'

/**
 * Controller for updating a Prisoner's Future Work Interest Roles part of an Induction.
 */
export default class WorkInterestRolesUpdateController extends WorkInterestRolesController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(req: Request): string {
    const { prisonerSummary } = req.session
    return `Back to ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s learning and work progress`
  }

  submitWorkInterestRolesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    const workInterestRoles = new Map(Object.entries({ ...req.body.workInterestRoles }))
    req.session.workInterestRolesForm = { workInterestRoles } as WorkInterestRolesForm
    const { workInterestRolesForm } = req.session

    const updatedInduction = this.updatedInductionDtoWithWorkInterestRoles(inductionDto, workInterestRolesForm)
    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

    try {
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.workInterestRolesForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  private updatedInductionDtoWithWorkInterestRoles(
    inductionDto: InductionDto,
    workInterestRolesForm: WorkInterestRolesForm,
  ): InductionDto {
    const updatedWorkInterests = inductionDto.futureWorkInterests.interests.map(interest => {
      return {
        workType: interest.workType,
        workTypeOther: interest.workTypeOther,
        role: workInterestRolesForm.workInterestRoles?.get(interest.workType),
      }
    })
    return {
      ...inductionDto,
      futureWorkInterests: {
        ...inductionDto.futureWorkInterests,
        interests: updatedWorkInterests,
      },
    }
  }
}
