import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationDetailsController from '../common/qualificationDetailsController'
import validateQualificationDetailsForm from '../../validators/induction/qualificationDetailsFormValidator'

export default class QualificationDetailsCreateController extends QualificationDetailsController {
  submitQualificationDetailsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData
    const { qualificationLevelForm } = req.session
    const { prisonerSummary } = res.locals

    req.session.qualificationDetailsForm = { ...req.body }
    const { qualificationDetailsForm } = req.session

    const errors = validateQualificationDetailsForm(
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
      prisonerSummary,
    )
    if (errors.length > 0) {
      return res.redirectWithErrors(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualification-details`,
        errors,
      )
    }

    const updatedInduction = this.addQualificationToInductionDto(
      inductionDto,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    req.journeyData.inductionDto = updatedInduction

    req.session.qualificationDetailsForm = undefined
    req.session.qualificationLevelForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/qualifications`)
  }
}
