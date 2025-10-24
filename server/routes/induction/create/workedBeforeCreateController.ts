import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkedBeforeForm } from 'inductionForms'
import type { InductionDto } from 'inductionDto'
import WorkedBeforeController from '../common/workedBeforeController'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

export default class WorkedBeforeCreateController extends WorkedBeforeController {
  submitWorkedBeforeForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData

    const workedBeforeForm: WorkedBeforeForm = { ...req.body }

    const updatedInduction = this.updatedInductionDtoWithHasWorkedBefore(inductionDto, workedBeforeForm)
    const prisonerHasWorkedBefore =
      updatedInduction.previousWorkExperiences.hasWorkedBefore === HasWorkedBeforeValue.YES
    req.journeyData.inductionDto = updatedInduction

    if (!this.previousPageWasCheckYourAnswers(req)) {
      if (prisonerHasWorkedBefore) {
        return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience`)
      }

      // Prisoner has not worked before; skip straight to Personal Skills
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/skills`)
    }

    if (!prisonerHasWorkedBefore) {
      // Previous page was Check Your Answers and prisoner has not worked before
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`)
    }

    // Previous page was Check Your Answers and prisoner has worked before - we need to ask about previous work experience
    return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience`)
  }

  updatedInductionDtoWithHasWorkedBefore(inductionDto: InductionDto, workedBeforeForm: WorkedBeforeForm): InductionDto {
    const updatedInduction = super.updatedInductionDtoWithHasWorkedBefore(inductionDto, workedBeforeForm)

    // If the prisoner has worked before return the updated induction
    if (workedBeforeForm.hasWorkedBefore === HasWorkedBeforeValue.YES) {
      return {
        ...updatedInduction,
        previousWorkExperiences: {
          ...updatedInduction.previousWorkExperiences,
          hasWorkedBeforeNotRelevantReason: undefined,
        },
      }
    }

    // If the prisoner has not worked before remove any previous worked experiences from the induction - this caters for the
    // user clicking the Change link on Check Your Answers and changing the answer from Yes to No
    return {
      ...updatedInduction,
      previousWorkExperiences: {
        ...updatedInduction.previousWorkExperiences,
        hasWorkedBeforeNotRelevantReason:
          workedBeforeForm.hasWorkedBefore === HasWorkedBeforeValue.NOT_RELEVANT
            ? workedBeforeForm.hasWorkedBeforeNotRelevantReason
            : undefined,
        experiences: [],
      },
    }
  }
}
