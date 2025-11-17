import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationDetailsController from '../common/qualificationDetailsController'

export default class QualificationDetailsCreateController extends QualificationDetailsController {
  submitQualificationDetailsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData
    const { qualificationLevelForm } = req.session

    const qualificationDetailsForm = { ...req.body }

    req.journeyData.inductionDto = this.addQualificationToInductionDto(
      inductionDto,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )

    req.session.qualificationLevelForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/qualifications`)
  }
}
