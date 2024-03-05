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

    let previousWorkExperienceType: TypeOfWorkExperienceValue
    try {
      previousWorkExperienceType = this.validateInductionContainsPreviousWorkExperienceOfType({
        req,
        inductionDto: inductionDto as InductionDto,
        invalidTypeOfWorkExperienceMessage: `Attempt to get Previous Work Experience Detail view for invalid work experience type ${typeOfWorkExperience} from ${prisonerSummary.prisonNumber}'s Induction`,
        typeOfWorkExperienceMissingOnInductionMessage: `Attempt to get Previous Work Experience Detail view for work experience type ${typeOfWorkExperience} that does not exist on ${prisonerSummary.prisonNumber}'s Induction`,
      })
    } catch (error) {
      return next(createError(404, `Previous Work Experience type ${typeOfWorkExperience} not found on Induction`))
    }

    const previousWorkExperienceDetailsForm =
      req.session.previousWorkExperienceDetailForm ||
      toPreviousWorkExperienceDetailForm(inductionDto, previousWorkExperienceType)
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

  /**
   * Validates the `typeOfWorkExperience` path parameter value is a valid TypeOfWorkExperienceValue and exists on the
   * induction.
   * @return the TypeOfWorkExperienceValue corresponding to the `typeOfWorkExperience` path parameter value
   * @throws Error if the specified type of work experience is not a valid TypeOfWorkExperienceValue
   * @throws Error if the specified type of work experience is valid but is not on the Induction
   */
  protected validateInductionContainsPreviousWorkExperienceOfType(options: {
    req: Request
    inductionDto: InductionDto
    invalidTypeOfWorkExperienceMessage: string
    typeOfWorkExperienceMissingOnInductionMessage: string
  }): TypeOfWorkExperienceValue {
    const { typeOfWorkExperience } = options.req.params

    const previousWorkExperienceType = Object.values(TypeOfWorkExperienceValue).find(
      type => type === typeOfWorkExperience.toUpperCase(),
    )
    if (!previousWorkExperienceType) {
      logger.warn(options.invalidTypeOfWorkExperienceMessage)
      throw new Error(`Invalid TypeOfWorkExperienceValue ${typeOfWorkExperience}`)
    }

    const previousWorkExperiencesOnInduction = options.inductionDto.previousWorkExperiences.experiences.map(
      experience => experience.experienceType,
    )
    if (!previousWorkExperiencesOnInduction.includes(previousWorkExperienceType)) {
      logger.warn(options.typeOfWorkExperienceMissingOnInductionMessage)
      throw new Error(`Previous work experience type ${previousWorkExperienceType} missing on Induction`)
    }

    return previousWorkExperienceType
  }
}

const toPreviousWorkExperienceDetailForm = (
  inductionDto: InductionDto,
  typeOfWorkExperience: TypeOfWorkExperienceValue,
): PreviousWorkExperienceDetailForm => {
  const previousWorkExperience = inductionDto.previousWorkExperiences?.experiences.find(
    experience => experience.experienceType === typeOfWorkExperience,
  )
  return {
    jobRole: previousWorkExperience?.role || '',
    jobDetails: previousWorkExperience?.details || '',
  }
}
