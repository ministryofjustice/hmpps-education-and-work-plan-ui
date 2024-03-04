import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import type { InductionDto } from 'inductionDto'
import InductionController from './inductionController'
import PreviousWorkExperienceTypesView from './previousWorkExperienceTypesView'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'

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
    const { prisonerSummary, inductionDto } = req.session

    const previousWorkExperienceDetailsForm =
      req.session.previousWorkExperienceTypesForm || toPreviousWorkExperienceTypesForm(inductionDto)
    req.session.previousWorkExperienceDetailForm = undefined

    const view = new PreviousWorkExperienceTypesView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      previousWorkExperienceDetailsForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/previousWorkExperience/workExperienceTypes', { ...view.renderArgs })
  }
}

const toPreviousWorkExperienceTypesForm = (inductionDto: InductionDto): PreviousWorkExperienceTypesForm => {
  return {
    typeOfWorkExperience:
      inductionDto.previousWorkExperiences?.experiences.map(experience => experience.experienceType) || [],
    typeOfWorkExperienceOther: inductionDto.previousWorkExperiences.experiences.find(
      experience => experience.experienceType === TypeOfWorkExperienceValue.OTHER,
    )?.experienceTypeOther,
  }
}
