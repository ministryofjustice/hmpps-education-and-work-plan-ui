import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { WantToAddQualificationsForm } from 'inductionForms'
import WantToAddQualificationsController from '../common/wantToAddQualificationsController'
import validateWantToAddQualificationsForm from './wantToAddQualificationsFormValidator'
import YesNoValue from '../../../enums/yesNoValue'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import EducationLevelValue from '../../../enums/educationLevelValue'

export default class WantToAddQualificationsUpdateController extends WantToAddQualificationsController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitWantToAddQualificationsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    req.session.wantToAddQualificationsForm = { ...req.body }
    const { wantToAddQualificationsForm } = req.session

    const errors = validateWantToAddQualificationsForm(wantToAddQualificationsForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/want-to-add-qualifications`)
    }

    req.session.wantToAddQualificationsForm = undefined

    // If the previous page was Check Your Answers
    if (this.previousPageWasCheckYourAnswers(req)) {
      if (formSubmittedFromCheckYourAnswersWithNoChangeMade(wantToAddQualificationsForm, inductionDto)) {
        // No changes made, redirect back to Check Your Answers
        return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      }

      if (formSubmittedIndicatingQualificationsShouldNotBeRecorded(wantToAddQualificationsForm)) {
        // User has come from the Check Your Answers page and has said they do not want to record any qualifications
        // We need to remove any qualifications that may have been set on the Induction
        const updatedInduction = inductionWithRemovedQualifications(inductionDto)
        req.session.inductionDto = updatedInduction
        return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      }

      // User has come from the Check Your Answers page and has said they DO want to record qualifications
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualifications`)
    }

    const nextPage =
      wantToAddQualificationsForm.wantToAddQualifications === YesNoValue.YES
        ? `/prisoners/${prisonNumber}/induction/qualification-level`
        : `/prisoners/${prisonNumber}/induction/additional-training`

    return res.redirect(nextPage)
  }
}

const inductionWithRemovedQualifications = (inductionDto: InductionDto): InductionDto => {
  return {
    ...inductionDto,
    previousQualifications: {
      ...inductionDto.previousQualifications,
      qualifications: [],
      educationLevel: EducationLevelValue.NOT_SURE, // Having removed all qualifications we cannot be sure of the Highest Level of Education, so set to NOT_SURE
    },
  }
}

const formSubmittedFromCheckYourAnswersWithNoChangeMade = (
  form: WantToAddQualificationsForm,
  inductionDto: InductionDto,
): boolean => {
  const qualificationsExistOnInduction: boolean = inductionDto.previousQualifications?.qualifications?.length > 0
  return (
    (!qualificationsExistOnInduction && formSubmittedIndicatingQualificationsShouldNotBeRecorded(form)) ||
    (qualificationsExistOnInduction && formSubmittedIndicatingQualificationsShouldBeRecorded(form))
  )
}

const formSubmittedIndicatingQualificationsShouldNotBeRecorded = (form: WantToAddQualificationsForm): boolean =>
  form.wantToAddQualifications === YesNoValue.NO

const formSubmittedIndicatingQualificationsShouldBeRecorded = (form: WantToAddQualificationsForm): boolean =>
  form.wantToAddQualifications === YesNoValue.YES
