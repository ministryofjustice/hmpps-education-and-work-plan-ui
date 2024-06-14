import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { WorkedBeforeForm } from 'inductionForms'
import InductionController from './inductionController'
import WorkedBeforeView from './workedBeforeView'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WorkedBeforeController extends InductionController {
  /**
   * Returns the WorkedBefore view; suitable for use by the Create and Update journeys.
   */
  getWorkedBeforeView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    // Check if we are in the midst of changing the main induction question set (in this case from short route to long route)
    if (req.session.updateInductionQuestionSet || req.session.pageFlowHistory) {
      this.addCurrentPageToHistory(req)
    }

    const workedBeforeForm = req.session.workedBeforeForm || toWorkedBeforeForm(inductionDto)
    req.session.workedBeforeForm = undefined

    const view = new WorkedBeforeView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      workedBeforeForm,
    )
    return res.render('pages/induction/workedBefore/index', { ...view.renderArgs })
  }

  protected updatedInductionDtoWithHasWorkedBefore(
    inductionDto: InductionDto,
    workedBeforeForm: WorkedBeforeForm,
  ): InductionDto {
    const previousExperience: Array<PreviousWorkExperienceDto> = []
    if (
      workedBeforeForm.hasWorkedBefore === HasWorkedBeforeValue.YES &&
      inductionDto.previousWorkExperiences?.experiences
    ) {
      previousExperience.push(...inductionDto.previousWorkExperiences.experiences)
    }
    return {
      ...inductionDto,
      previousWorkExperiences: {
        ...inductionDto.previousWorkExperiences,
        experiences: previousExperience,
        hasWorkedBefore: workedBeforeForm.hasWorkedBefore,
      },
    }
  }
}

const toWorkedBeforeForm = (inductionDto: InductionDto): WorkedBeforeForm => {
  const hasWorkedBefore = inductionDto.previousWorkExperiences?.hasWorkedBefore
  if (hasWorkedBefore) {
    return {
      hasWorkedBefore,
    }
  }

  // hasWorkedBefore in the Induction is not set, meaning this is a new Induction. Set the form field
  // to undefined to force the user to answer it
  return {
    hasWorkedBefore: undefined,
  }
}
