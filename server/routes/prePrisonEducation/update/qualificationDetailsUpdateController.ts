import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationDetailsController from '../common/qualificationDetailsController'

export default class QualificationDetailsUpdateController extends QualificationDetailsController {
  journeyPathElement = 'education'

  submitQualificationDetailsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params

    const { educationDto } = req.journeyData
    const { qualificationLevel } = req.journeyData
    const qualificationDetailsForm = { ...req.body }

    const updatedEducation = this.addQualificationToEducationDto(
      educationDto,
      qualificationDetailsForm,
      qualificationLevel,
    )
    req.journeyData.educationDto = updatedEducation
    req.journeyData.qualificationLevel = undefined

    return res.redirect(`/prisoners/${prisonNumber}/education/${journeyId}/qualifications`)
  }
}
