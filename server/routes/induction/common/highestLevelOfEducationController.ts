import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { HighestLevelOfEducationForm } from 'forms'
import InductionController from './inductionController'
import HighestLevelOfEducationView from './highestLevelOfEducationView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class HighestLevelOfEducationController extends InductionController {
  /**
   * Returns the Highest Level of Education view; suitable for use by the Create and Update journeys.
   */
  getHighestLevelOfEducationView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    if (req.session.pageFlowHistory) {
      this.addCurrentPageToHistory(req)
    }

    const highestLevelOfEducationForm =
      req.session.highestLevelOfEducationForm || toHighestLevelOfEducationForm(inductionDto)
    req.session.highestLevelOfEducationForm = undefined

    const view = new HighestLevelOfEducationView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      highestLevelOfEducationForm,
    )
    return res.render('pages/prePrisonEducation/highestLevelOfEducation', { ...view.renderArgs })
  }

  updatedInductionDtoWithHighestLevelOfEducation = (
    inductionDto: InductionDto,
    highestLevelOfEducationForm: HighestLevelOfEducationForm,
  ): InductionDto => {
    return {
      ...inductionDto,
      previousQualifications: {
        ...inductionDto.previousQualifications,
        qualifications: inductionDto.previousQualifications?.qualifications, // [...(inductionDto.previousQualifications?.qualifications || [])],
        educationLevel: highestLevelOfEducationForm.educationLevel,
      },
    }
  }
}

const toHighestLevelOfEducationForm = (inductionDto: InductionDto): HighestLevelOfEducationForm => {
  return {
    educationLevel: inductionDto.previousQualifications?.educationLevel,
  }
}
