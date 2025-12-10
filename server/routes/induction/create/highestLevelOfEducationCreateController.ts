import { NextFunction, Request, RequestHandler, Response } from 'express'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'

export default class HighestLevelOfEducationCreateController extends HighestLevelOfEducationController {
  submitHighestLevelOfEducationForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { inductionDto } = req.journeyData

    const highestLevelOfEducationForm = { ...req.body }

    const updatedInduction = this.updatedInductionDtoWithHighestLevelOfEducation(
      inductionDto,
      highestLevelOfEducationForm,
    )
    req.journeyData.inductionDto = updatedInduction

    let nextPage: string
    if (req.query?.submitToCheckAnswers === 'true') {
      nextPage = 'check-your-answers'
    } else {
      nextPage =
        updatedInduction.previousQualifications.qualifications?.length > 0
          ? 'qualifications' // if the induction already has qualifications (from being entered prior to the Induction) skip straight to the Qualifications List page
          : 'want-to-add-qualifications'
    }
    return res.redirect(nextPage)
  }
}
