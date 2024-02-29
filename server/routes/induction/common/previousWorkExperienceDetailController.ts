import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PreviousWorkExperienceDetailForm } from 'inductionForms'
import type { InductionDto } from 'inductionDto'
import InductionController from './inductionController'
import PreviousWorkExperienceDetailView from './previousWorkExperienceDetailView'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import logger from '../../../../logger'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class PreviousWorkExperienceDetailController extends InductionController {
  constructor() {
    super()
  }

  /**
   * Returns the Previous Work Experience Detail view; suitable for use by the Create and Update journeys.
   */
  getPreviousWorkExperienceDetailView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session
    const { typeOfWorkExperience } = req.params

    const previousWorkExperienceType = Object.values(TypeOfWorkExperienceValue).find(
      type => type === typeOfWorkExperience.toUpperCase(),
    )
    if (!previousWorkExperienceType) {
      logger.warn(
        `Attempt to get Previous Work Experience Detail view for invalid work experience type ${typeOfWorkExperience} from ${prisonerSummary.prisonNumber}'s Induction`,
      )
      return next(createError(404, `Previous Work Experience type ${typeOfWorkExperience} not found on Induction`))
    }

    const previousWorkExperienceDetailsForm =
      req.session.previousWorkExperienceDetailForm ||
      toPreviousWorkExperienceDetailForm(inductionDto, previousWorkExperienceType)
    if (!previousWorkExperienceDetailsForm) {
      logger.warn(
        `Attempt to get Previous Work Experience Detail view for work experience type ${typeOfWorkExperience} that does not exist on ${prisonerSummary.prisonNumber}'s Induction`,
      )
      return next(createError(404, `Previous Work Experience type ${typeOfWorkExperience} not found on Induction`))
    }
    req.session.previousWorkExperienceDetailForm = undefined

    const view = new PreviousWorkExperienceDetailView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      previousWorkExperienceDetailsForm,
      previousWorkExperienceType,
      req.flash('errors'),
    )
    return res.render('pages/induction/previousWorkExperience/workExperienceDetail', { ...view.renderArgs })
  }
}

const toPreviousWorkExperienceDetailForm = (
  inductionDto: InductionDto,
  typeOfWorkExperience: TypeOfWorkExperienceValue,
): PreviousWorkExperienceDetailForm => {
  const previousWorkExperience = inductionDto.previousWorkExperiences.experiences.find(
    experience => experience.experienceType === typeOfWorkExperience,
  )
  return previousWorkExperience
    ? {
        jobRole: previousWorkExperience.role,
        jobDetails: previousWorkExperience.details,
      }
    : undefined
}
