import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { WorkInterestTypesForm } from 'inductionForms'
import WorkInterestTypesController from '../common/workInterestTypesController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateWorkInterestTypesForm from '../../validators/induction/workInterestTypesFormValidator'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import { asArray } from '../../../utils/utils'

/**
 * Controller for updating a Prisoner's Future Work Interest Types part of an Induction.
 */
export default class WorkInterestTypesUpdateController extends WorkInterestTypesController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitWorkInterestTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const workInterestTypesForm: WorkInterestTypesForm = {
      workInterestTypes: asArray(req.body.workInterestTypes),
      workInterestTypesOther: req.body.workInterestTypesOther,
    }
    getPrisonerContext(req.session, prisonNumber).workInterestTypesForm = workInterestTypesForm

    const errors = validateWorkInterestTypesForm(workInterestTypesForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/work-interest-types`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithWorkInterestTypes(inductionDto, workInterestTypesForm)

    // If there is a hopingToWorkOnReleaseForm on the prisoner context it means the user is updating a prisoners induction by changing whether they want to work on release.
    // In this case we need to go to Work Interest Roles in order to complete the capture the prisoners future work interests.
    if (getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm) {
      getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInduction
      return res.redirect(`/prisoners/${prisonNumber}/induction/work-interest-roles`)
    }

    // Else we can simply call the API to update the Induction and return to Work & Interests tab
    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username)

      getPrisonerContext(req.session, prisonNumber).workInterestTypesForm = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
