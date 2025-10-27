import { NextFunction, Request, RequestHandler, Response } from 'express'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'

export default class HighestLevelOfEducationCreateController extends HighestLevelOfEducationController {
  submitHighestLevelOfEducationForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { educationDto } = req.journeyData

    const highestLevelOfEducationForm = { ...req.body }

    const updatedEducationDto = this.updatedEducationDtoWithHighestLevelOfEducation(
      educationDto,
      highestLevelOfEducationForm,
    )
    req.journeyData.educationDto = updatedEducationDto

    return res.redirect(`/prisoners/${prisonNumber}/create-education/${journeyId}/qualification-level`)
  }
}
