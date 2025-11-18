import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationDetailsController from '../common/qualificationDetailsController'

export default class QualificationDetailsCreateController extends QualificationDetailsController {
  submitQualificationDetailsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto, qualificationLevel } = req.journeyData

    const qualificationDetailsForm = { ...req.body }

    req.journeyData.inductionDto = this.addQualificationToInductionDto(
      inductionDto,
      qualificationDetailsForm,
      qualificationLevel,
    )

    req.journeyData.qualificationLevel = undefined

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/qualifications`)
  }
}
