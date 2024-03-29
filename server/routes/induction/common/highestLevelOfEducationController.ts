import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { HighestLevelOfEducationForm } from 'inductionForms'
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

    // Check if we are in the midst of changing the main induction question set (in this case from short route to long route)
    if (req.session.updateInductionQuestionSet) {
      const { prisonNumber } = req.params
      this.addCurrentPageToHistory(req, `/prisoners/${prisonNumber}/induction/highest-level-of-education`)
    }

    const highestLevelOfEducationForm =
      req.session.highestLevelOfEducationForm || toHighestLevelOfEducationForm(inductionDto)
    req.session.highestLevelOfEducationForm = undefined

    const view = new HighestLevelOfEducationView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      highestLevelOfEducationForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/prePrisonEducation/highestLevelOfEducation', { ...view.renderArgs })
  }
}

const toHighestLevelOfEducationForm = (inductionDto: InductionDto): HighestLevelOfEducationForm => {
  return {
    educationLevel: inductionDto.previousQualifications?.educationLevel,
  }
}
