import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { QualificationDetailsForm } from 'forms'
import QualificationDetailsController from '../common/qualificationDetailsController'
import validateQualificationDetailsForm from '../../validators/induction/qualificationDetailsFormValidator'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class QualificationDetailsCreateController extends QualificationDetailsController {
  submitQualificationDetailsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionDto, qualificationLevelForm } = getPrisonerContext(req.session, prisonNumber)

    const qualificationDetailsForm: QualificationDetailsForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = qualificationDetailsForm

    const errors = validateQualificationDetailsForm(
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
      prisonerSummary,
    )
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/qualification-details`, errors)
    }

    const updatedInduction = this.addQualificationToInductionDto(
      inductionDto,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInduction

    getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined
    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/qualifications`)
  }
}
