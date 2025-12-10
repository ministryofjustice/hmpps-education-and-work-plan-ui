import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WantToAddQualificationsForm } from 'inductionForms'
import type { InductionDto } from 'inductionDto'
import InductionController from './inductionController'
import YesNoValue from '../../../enums/yesNoValue'
import EducationLevelValue from '../../../enums/educationLevelValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WantToAddQualificationsController extends InductionController {
  /**
   * Returns the Want to Add Qualifications view; suitable for use by the Create and Update journeys.
   */
  getWantToAddQualificationsView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonerSummary, prisonerFunctionalSkills, prisonNamesById, curiousInPrisonCourses, invalidForm } =
      res.locals

    const wantToAddQualificationsForm = invalidForm || createWantToAddQualificationsForm(inductionDto)

    return res.render('pages/prePrisonEducation/wantToAddQualifications', {
      prisonerSummary,
      form: wantToAddQualificationsForm,
      prisonNamesById,
      prisonerFunctionalSkills,
      inPrisonCourses: curiousInPrisonCourses,
    })
  }

  protected formSubmittedFromCheckYourAnswersWithNoChangeMade = (
    form: WantToAddQualificationsForm,
    inductionDto: InductionDto,
  ): boolean => {
    const qualificationsExistOnInduction: boolean = inductionDto.previousQualifications?.qualifications?.length > 0
    return (
      (!qualificationsExistOnInduction && this.formSubmittedIndicatingQualificationsShouldNotBeRecorded(form)) ||
      (qualificationsExistOnInduction && this.formSubmittedIndicatingQualificationsShouldBeRecorded(form))
    )
  }

  protected formSubmittedIndicatingQualificationsShouldNotBeRecorded = (form: WantToAddQualificationsForm): boolean =>
    form.wantToAddQualifications === YesNoValue.NO

  protected formSubmittedIndicatingQualificationsShouldBeRecorded = (form: WantToAddQualificationsForm): boolean =>
    form.wantToAddQualifications === YesNoValue.YES

  protected inductionWithRemovedQualifications = (inductionDto: InductionDto): InductionDto => {
    return {
      ...inductionDto,
      previousQualifications: {
        ...inductionDto.previousQualifications,
        qualifications: [],
        educationLevel: inductionDto.previousQualifications?.educationLevel || EducationLevelValue.NOT_SURE, // Keep the Highest Level of Education unless it is not set in which case set to NOT_SURE
        needToCompleteJourneyFromCheckYourAnswers: false,
      },
    }
  }
}

const createWantToAddQualificationsForm = (inductionDto: InductionDto): WantToAddQualificationsForm => {
  const numberOfQualificationsAlreadyOnInduction = inductionDto.previousQualifications?.qualifications?.length
  if (Number.isInteger(numberOfQualificationsAlreadyOnInduction)) {
    return {
      wantToAddQualifications: numberOfQualificationsAlreadyOnInduction > 0 ? YesNoValue.YES : YesNoValue.NO,
    }
  }

  // There is no previousQualifications or qualifications objects on the induction, so this is a new Induction where
  // this is the first time the question is being asked. Therefore the field `wantToAddQualifications` should be
  // undefined so that the user is forced to answer it.
  return {
    wantToAddQualifications: undefined,
  }
}
