import { Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import WantToAddQualificationsController from '../common/wantToAddQualificationsController'
import YesNoValue from '../../../enums/yesNoValue'
import validateWantToAddQualificationsForm from '../../validators/induction/wantToAddQualificationsFormValidator'
import EducationLevelValue from '../../../enums/educationLevelValue'

export default class WantToAddQualificationsCreateController extends WantToAddQualificationsController {
  submitWantToAddQualificationsForm: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals

    req.session.wantToAddQualificationsForm = { ...req.body }
    const { wantToAddQualificationsForm } = req.session

    const errors = validateWantToAddQualificationsForm(wantToAddQualificationsForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`, errors)
    }

    req.session.wantToAddQualificationsForm = undefined

    const updatedInduction = updatedInductionDtoWithDefaultQualificationData(
      inductionDto,
      wantToAddQualificationsForm.wantToAddQualifications === YesNoValue.YES,
    )
    req.session.inductionDto = updatedInduction

    // If the previous page was Check Your Answers
    if (this.previousPageWasCheckYourAnswers(req)) {
      if (this.formSubmittedFromCheckYourAnswersWithNoChangeMade(wantToAddQualificationsForm, inductionDto)) {
        // No changes made, redirect back to Check Your Answers
        return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      }

      if (this.formSubmittedIndicatingQualificationsShouldNotBeRecorded(wantToAddQualificationsForm)) {
        // User has come from the Check Your Answers page and has said they do not want to record any qualifications
        // We need to remove any qualifications that may have been set on the Induction
        req.session.inductionDto = this.inductionWithRemovedQualifications(inductionDto)
        return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      }

      // User has come from the Check Your Answers page and has said they DO want to record qualifications
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/qualification-level`)
    }

    const nextPage =
      wantToAddQualificationsForm.wantToAddQualifications === YesNoValue.YES
        ? `/prisoners/${prisonNumber}/create-induction/qualification-level`
        : `/prisoners/${prisonNumber}/create-induction/additional-training`

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
    },
  }
}
