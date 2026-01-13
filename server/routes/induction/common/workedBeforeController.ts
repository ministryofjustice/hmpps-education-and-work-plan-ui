import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { WorkedBeforeForm } from 'inductionForms'
import WorkedBeforeView from './workedBeforeView'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'
import { clearRedirectPendingFlag } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WorkedBeforeController {
  /**
   * Returns the WorkedBefore view; suitable for use by the Create and Update journeys.
   */
  getWorkedBeforeView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

    clearRedirectPendingFlag(req)

    const workedBeforeForm = invalidForm
      ? {
          hasWorkedBefore: invalidForm.hasWorkedBefore,
          hasWorkedBeforeNotRelevantReason: invalidForm.hasWorkedBeforeNotRelevantReason,
        }
      : toWorkedBeforeForm(inductionDto)

    const view = new WorkedBeforeView(prisonerSummary, workedBeforeForm)
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
        hasWorkedBeforeNotRelevantReason:
          workedBeforeForm.hasWorkedBefore === HasWorkedBeforeValue.NOT_RELEVANT
            ? workedBeforeForm.hasWorkedBeforeNotRelevantReason
            : undefined,
      },
    }
  }
}

const toWorkedBeforeForm = (inductionDto: InductionDto): WorkedBeforeForm => {
  const hasWorkedBefore = inductionDto.previousWorkExperiences?.hasWorkedBefore
  if (hasWorkedBefore) {
    return {
      hasWorkedBefore,
      hasWorkedBeforeNotRelevantReason: inductionDto.previousWorkExperiences.hasWorkedBeforeNotRelevantReason,
    }
  }

  // hasWorkedBefore in the Induction is not set, meaning this is a new Induction. Set the form fields
  // to undefined to force the user to answer them
  return {
    hasWorkedBefore: undefined,
    hasWorkedBeforeNotRelevantReason: undefined,
  }
}
