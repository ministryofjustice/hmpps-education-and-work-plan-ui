import { NextFunction, Request, RequestHandler, Response } from 'express'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'

export default class HighestLevelOfEducationCreateController extends HighestLevelOfEducationController {
  submitHighestLevelOfEducationForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData

    const highestLevelOfEducationForm = { ...req.body }

    const updatedInduction = this.updatedInductionDtoWithHighestLevelOfEducation(
      inductionDto,
      highestLevelOfEducationForm,
    )
    req.journeyData.inductionDto = updatedInduction

    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`)
    }

    const nextPage =
      updatedInduction.previousQualifications.qualifications?.length > 0
        ? `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualifications` // if the induction already has qualifications (from being entered prior to the Induction) skip straight to the Qualifications List page
        : `/prisoners/${prisonNumber}/create-induction/${journeyId}/want-to-add-qualifications`
    return res.redirect(nextPage)
  }
}
