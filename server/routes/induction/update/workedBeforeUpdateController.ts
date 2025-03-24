import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { WorkedBeforeForm } from 'inductionForms'
import WorkedBeforeController from '../common/workedBeforeController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateWorkedBeforeForm from '../../validators/induction/workedBeforeFormValidator'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

/**
 * Controller for the Update of the Worked Before screen of the Induction.
 */
export default class WorkedBeforeUpdateController extends WorkedBeforeController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitWorkedBeforeForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const workedBeforeForm: WorkedBeforeForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).workedBeforeForm = workedBeforeForm

    const errors = validateWorkedBeforeForm(workedBeforeForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/has-worked-before`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithHasWorkedBefore(inductionDto, workedBeforeForm)
    const prisonerHasWorkedBefore =
      updatedInduction.previousWorkExperiences.hasWorkedBefore === HasWorkedBeforeValue.YES

    if (prisonerHasWorkedBefore) {
      getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInduction
      getPrisonerContext(req.session, prisonNumber).workedBeforeForm = undefined
      return res.redirect(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
    }
    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username)

      getPrisonerContext(req.session, prisonNumber).inductionDto = undefined
      getPrisonerContext(req.session, prisonNumber).workedBeforeForm = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
