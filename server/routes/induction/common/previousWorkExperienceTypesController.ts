import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import InductionController from './inductionController'
import PreviousWorkExperienceTypesView from './previousWorkExperienceTypesView'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import { asArray } from '../../../utils/utils'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class PreviousWorkExperienceTypesController extends InductionController {
  /**
   * Returns the Previous Work Experience Types view; suitable for use by the Create and Update journeys.
   */
  getPreviousWorkExperienceTypesView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const previousWorkExperienceDetailsForm = invalidForm
      ? {
          typeOfWorkExperience: asArray(invalidForm.typeOfWorkExperience),
          typeOfWorkExperienceOther: invalidForm.typeOfWorkExperienceOther,
        }
      : toPreviousWorkExperienceTypesForm(inductionDto)

    const view = new PreviousWorkExperienceTypesView(prisonerSummary, previousWorkExperienceDetailsForm)
    return res.render('pages/induction/previousWorkExperience/workExperienceTypes', { ...view.renderArgs })
  }

  /**
   * Returns an [InductionDto] that represents the Induction with the changes from the [PreviousWorkExperienceTypesForm]
   * This method returns an [InductionDto] based on the passed in DTO with
   *   * Any Previous Work Experiences removed where they are removed (missing) in the [PreviousWorkExperienceTypesForm]
   *   * The value for Other has been changed where it has been changed in the [PreviousWorkExperienceTypesForm]
   *   * Any new Previous Work Experiences added where they are new (additional) in the [PreviousWorkExperienceTypesForm]
   *     In the case of new Previous Work Experiences, a new array element is added with the corresponding type, but the
   *     `role` and `details` fields are left undefined as the user has not entered these details yet.
   */
  updatedInductionDtoWithPreviousWorkExperiences = (
    inductionDto: InductionDto,
    previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  ): InductionDto => {
    const updatedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> =
      previousWorkExperienceTypesForm.typeOfWorkExperience.map(workType => {
        const existingWorkExperience = inductionDto.previousWorkExperiences?.experiences?.find(
          experience => experience.experienceType === workType,
        )
        const isWorkTypeOther = workType === TypeOfWorkExperienceValue.OTHER
        const workTypeOtherValueHasBeenChanged =
          isWorkTypeOther &&
          previousWorkExperienceTypesForm.typeOfWorkExperienceOther !== existingWorkExperience?.experienceTypeOther

        return !existingWorkExperience
          ? {
              // It's a new Previous Work Experience that is not already on the Induction. Add it but with undefined role and details fields
              experienceType: workType,
              experienceTypeOther: isWorkTypeOther ? previousWorkExperienceTypesForm.typeOfWorkExperienceOther : null,
              role: undefined,
              details: undefined,
            }
          : {
              // It's a Previous Work Experience that is already on the Induction. Map it, but if the work type is OTHER
              // map the typeOfWorkExperienceOther field from the form and clear the previous role and details values
              // IE. it's a different kind of "other" so the previous role and details will likely not apply.
              experienceType: workType,
              experienceTypeOther: isWorkTypeOther ? previousWorkExperienceTypesForm.typeOfWorkExperienceOther : null,
              role: isWorkTypeOther && workTypeOtherValueHasBeenChanged ? undefined : existingWorkExperience?.role,
              details:
                isWorkTypeOther && workTypeOtherValueHasBeenChanged ? undefined : existingWorkExperience?.details,
            }
      })

    return {
      ...inductionDto,
      previousWorkExperiences: {
        ...inductionDto.previousWorkExperiences,
        experiences: updatedPreviousWorkExperiences,
      },
    }
  }
}

const toPreviousWorkExperienceTypesForm = (inductionDto: InductionDto): PreviousWorkExperienceTypesForm => {
  return {
    typeOfWorkExperience:
      inductionDto.previousWorkExperiences?.experiences?.map(experience => experience.experienceType) || [],
    typeOfWorkExperienceOther: inductionDto.previousWorkExperiences?.experiences?.find(
      experience => experience.experienceType === TypeOfWorkExperienceValue.OTHER,
    )?.experienceTypeOther,
  }
}
