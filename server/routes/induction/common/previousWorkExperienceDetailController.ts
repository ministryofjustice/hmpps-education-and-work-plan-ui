import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PreviousWorkExperienceDetailForm } from 'inductionForms'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
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
    const inductionDto = req.session.inductionDto ?? req.journeyData?.inductionDto
    const { prisonerSummary } = res.locals
    const { typeOfWorkExperience } = req.params

    let previousWorkExperienceType: TypeOfWorkExperienceValue
    try {
      previousWorkExperienceType = this.validateInductionContainsPreviousWorkExperienceOfType({
        req,
        inductionDto: inductionDto as InductionDto,
        invalidTypeOfWorkExperienceMessage: `Attempt to get Previous Work Experience Detail view for invalid work experience type ${typeOfWorkExperience} from ${prisonerSummary.prisonNumber}'s Induction`,
        typeOfWorkExperienceMissingOnInductionMessage: `Attempt to get Previous Work Experience Detail view for work experience type ${typeOfWorkExperience} that does not exist on ${prisonerSummary.prisonNumber}'s Induction`,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(createError(404, `Previous Work Experience type ${typeOfWorkExperience} not found on Induction`))
    }

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const previousWorkExperienceDetailsForm =
      req.session.previousWorkExperienceDetailForm ||
      toPreviousWorkExperienceDetailForm(inductionDto, previousWorkExperienceType)
    req.session.previousWorkExperienceDetailForm = undefined

    const view = new PreviousWorkExperienceDetailView(
      prisonerSummary,
      previousWorkExperienceDetailsForm,
      previousWorkExperienceType,
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

  protected updatedInductionDtoWithPreviousWorkExperienceDetail(
    inductionDto: InductionDto,
    previousWorkExperienceDetailForm: PreviousWorkExperienceDetailForm,
    previousWorkExperienceType: TypeOfWorkExperienceValue,
  ): InductionDto {
    const updatedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> =
      inductionDto.previousWorkExperiences?.experiences?.map(experience => {
        if (experience.experienceType === previousWorkExperienceType) {
          return {
            ...experience,
            role: previousWorkExperienceDetailForm.jobRole,
            details: previousWorkExperienceDetailForm.jobDetails,
          }
        }
        return {
          ...experience,
        }
      }) || []

    return {
      ...inductionDto,
      previousWorkExperiences: {
        ...inductionDto.previousWorkExperiences,
        experiences: updatedPreviousWorkExperiences,
      },
    }
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
