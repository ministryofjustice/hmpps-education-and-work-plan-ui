import { Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import WantToAddQualificationsController from '../common/wantToAddQualificationsController'
import YesNoValue from '../../../enums/yesNoValue'
import EducationLevelValue from '../../../enums/educationLevelValue'

export default class WantToAddQualificationsCreateController extends WantToAddQualificationsController {
  submitWantToAddQualificationsForm: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { inductionDto } = req.journeyData

    const wantToAddQualificationsForm = { ...req.body }

    const updatedInduction = updatedInductionDtoWithDefaultQualificationData(
      inductionDto,
      wantToAddQualificationsForm.wantToAddQualifications === YesNoValue.YES,
    )
    req.journeyData.inductionDto = updatedInduction

    const previousPageWasCheckYourAnswers = req.query?.submitToCheckAnswers === 'true'

    let nextPage: string
    // If the previous page was Check Your Answers
    if (previousPageWasCheckYourAnswers) {
      if (this.formSubmittedFromCheckYourAnswersWithNoChangeMade(wantToAddQualificationsForm, inductionDto)) {
        // No changes made, redirect back to Check Your Answers
        nextPage = 'check-your-answers'
      } else if (this.formSubmittedIndicatingQualificationsShouldNotBeRecorded(wantToAddQualificationsForm)) {
        // User has come from the Check Your Answers page and has said they do not want to record any qualifications
        // We need to remove any qualifications that may have been set on the Induction
        req.journeyData.inductionDto = this.inductionWithRemovedQualifications(inductionDto)
        nextPage = 'check-your-answers'
      } else {
        // User has come from the Check Your Answers page and has said they DO want to record qualifications
        // Go to Qualification Level to allow them to start entering qualifications
        req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers = true
        nextPage = 'qualification-level'
      }
    } else {
      // User has NOT come from Check Your Answers so is part of the initial Create Induction flow. The next page is either
      // Qualification Level allowing the user to start entering qualifications, or Additional Training if the user does not
      // want to enter qualifications.
      nextPage =
        wantToAddQualificationsForm.wantToAddQualifications === YesNoValue.YES
          ? 'qualification-level'
          : 'additional-training'
    }
    return res.redirect(nextPage)
  }
}

const updatedInductionDtoWithDefaultQualificationData = (
  inductionDto: InductionDto,
  wantToAddQualifications: boolean,
): InductionDto => {
  const qualifications = wantToAddQualifications ? [...(inductionDto.previousQualifications?.qualifications || [])] : []
  return {
    ...inductionDto,
    previousQualifications: {
      ...inductionDto.previousQualifications,
      qualifications,
      educationLevel: inductionDto.previousQualifications?.educationLevel || EducationLevelValue.NOT_SURE,
      needToCompleteJourneyFromCheckYourAnswers: false,
    },
  }
}
