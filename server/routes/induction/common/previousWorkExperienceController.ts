import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { PreviousWorkExperienceForm } from 'inductionForms'
import InductionController from './inductionController'
import PreviousWorkExperienceView from './previousWorkExperienceView'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class PreviousWorkExperienceController extends InductionController {
  constructor() {
    super()
  }

  /**
   * Returns the Previous Work Experience view; suitable for use by the Create and Update journeys.
   */
  getPreviousWorkExperienceView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    const previousWorkExperienceForm =
      req.session.previousWorkExperienceForm || toPreviousWorkExperienceForm(inductionDto)
    req.session.previousWorkExperienceForm = undefined

    const view = new PreviousWorkExperienceView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      previousWorkExperienceForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/previousWorkExperience/index', { ...view.renderArgs })
  }
}

const toPreviousWorkExperienceForm = (inductionDto: InductionDto): PreviousWorkExperienceForm => {
  return {
    typeOfWorkExperience: inductionDto.previousWorkExperiences.experiences.map(experience => experience.experienceType),
    typeOfWorkExperienceOther: inductionDto.previousWorkExperiences.experiences.find(
      experience => experience.experienceType === TypeOfWorkExperienceValue.OTHER,
    )?.experienceTypeOther,
  }
}
