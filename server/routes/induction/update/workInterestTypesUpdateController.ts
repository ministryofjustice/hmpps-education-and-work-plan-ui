import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { FutureWorkInterestDto, InductionDto } from 'inductionDto'
import type { WorkInterestTypesForm } from 'inductionForms'
import WorkInterestTypesController from '../common/workInterestTypesController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateWorkInterestTypesForm from './workInterestTypesFormValidator'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'

/**
 * Controller for updating a Prisoner's Future Work Interest Types part of an Induction.
 */
export default class WorkInterestTypesUpdateController extends WorkInterestTypesController {
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

  submitWorkInterestTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.workInterestTypesForm = { ...req.body }
    if (!req.session.workInterestTypesForm.workInterestTypes) {
      req.session.workInterestTypesForm.workInterestTypes = []
    }
    if (!Array.isArray(req.session.workInterestTypesForm.workInterestTypes)) {
      req.session.workInterestTypesForm.workInterestTypes = [req.session.workInterestTypesForm.workInterestTypes]
    }
    const { workInterestTypesForm } = req.session

    const errors = validateWorkInterestTypesForm(workInterestTypesForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/work-interest-types`)
    }

    const updatedInduction = this.updatedInductionDtoWithWorkInterestTypes(inductionDto, workInterestTypesForm)
    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

    try {
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.workInterestTypesForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  private updatedInductionDtoWithWorkInterestTypes(
    inductionDto: InductionDto,
    workInterestTypesForm: WorkInterestTypesForm,
  ): InductionDto {
    const updatedWorkInterests: Array<FutureWorkInterestDto> = workInterestTypesForm.workInterestTypes.map(workType => {
      return {
        workType,
        workTypeOther:
          workType === WorkInterestTypeValue.OTHER ? workInterestTypesForm.workInterestTypesOther : undefined,
        role: inductionDto.futureWorkInterests?.interests.find(interest => interest.workType === workType)?.role,
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
