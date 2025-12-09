import { NextFunction, Request, RequestHandler, Response } from 'express'
import HopingToWorkOnReleaseController from '../common/hopingToWorkOnReleaseController'
import YesNoValue from '../../../enums/yesNoValue'

export default class HopingToWorkOnReleaseCreateController extends HopingToWorkOnReleaseController {
  submitHopingToWorkOnReleaseForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { inductionDto } = req.journeyData

    const hopingToWorkOnReleaseForm = { ...req.body }

    const previousPageWasCheckYourAnswers = req.query?.submitToCheckAnswers === 'true'

    // If the previous page was Check Your Answers and the user has not changed the answer, go back to Check Your Answers
    if (previousPageWasCheckYourAnswers && this.answerHasNotBeenChanged(inductionDto, hopingToWorkOnReleaseForm)) {
      return res.redirect('check-your-answers')
    }

    const updatedInduction = this.updatedInductionDtoWithHopingToWorkOnRelease(inductionDto, hopingToWorkOnReleaseForm)
    if (previousPageWasCheckYourAnswers && updatedInduction.workOnRelease.hopingToWork === YesNoValue.YES) {
      updatedInduction.futureWorkInterests.needToCompleteJourneyFromCheckYourAnswers = true
    }
    req.journeyData.inductionDto = updatedInduction

    let nextPage: string
    if (previousPageWasCheckYourAnswers) {
      // If the previous page was Check Your Answers we either need to go back there in the case the prisoner does not want to work
      // or go to Work Interest Types in order to capture the prisoners future work interests.
      nextPage =
        updatedInduction.workOnRelease.hopingToWork !== YesNoValue.YES ? 'check-your-answers' : 'work-interest-types'
    } else {
      // The previous page was not Check Your Answers so we are part of the regular Create journey. Depending on whether
      // the prisoner wants to work or not the next page is either Work Interest Types or Affect Ability To Work.
      nextPage =
        updatedInduction.workOnRelease.hopingToWork === YesNoValue.YES
          ? 'work-interest-types'
          : 'affect-ability-to-work'
    }
    return res.redirect(nextPage)
  }
}
