import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PreviousWorkExperienceDetailForm } from 'inductionForms'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { PageFlow } from 'viewModels'
import InductionController from './inductionController'
import PreviousWorkExperienceDetailView from './previousWorkExperienceDetailView'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import logger from '../../../../logger'
import previousWorkExperienceTypeScreenOrderComparator from '../previousWorkExperienceTypeScreenOrderComparator'

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
    const { journeyId, prisonNumber, typeOfWorkExperience } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

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

    if (
      req.originalUrl?.includes('/create-induction/') &&
      !this.previousPageWasCheckYourAnswers(req) &&
      !req.session.pageFlowQueue
    ) {
      // If this is part of the "create induction" journey, and the previous page was not Check Your Answers and there is
      // no PageFlowQueue then the user is using the Back navigation and has arrived on this Previous Work Experience
      // detail screen.
      // To be able to proceed forwards again we need a properly constructed and populated PageFlowQueue
      logger.debug(
        `User has navigated Back to arrive on this Previous Work Experience Detail screen for ${previousWorkExperienceType}. Setting up a PageFlowQueue.`,
      )
      req.session.pageFlowQueue = buildPageFlowQueue(inductionDto, prisonNumber, journeyId, previousWorkExperienceType)
    }

    const previousWorkExperienceDetailsForm =
      invalidForm || toPreviousWorkExperienceDetailForm(inductionDto, previousWorkExperienceType)

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

/**
 * Builds and returns a Page Flow Queue to show the Details page for each work experience type. The list of pages to be
 * added to the queue is the list of work types on the induction.
 */
const buildPageFlowQueue = (
  induction: InductionDto,
  prisonNumber: string,
  journeyId: string,
  workExperienceType: TypeOfWorkExperienceValue,
): PageFlow => {
  const workExperienceTypesOnUpdatedInduction = (induction.previousWorkExperiences.experiences || []).map(
    experience => experience.experienceType,
  )

  const workExperienceTypesToShowDetailsFormFor = [...workExperienceTypesOnUpdatedInduction].sort(
    previousWorkExperienceTypeScreenOrderComparator, // sort them by the order presented on screen (which is not alphabetic on the enum values)
  )

  const nextPages = workExperienceTypesToShowDetailsFormFor.map(
    workType =>
      `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/${workType.toLowerCase()}`,
  )
  const pageUrls = [`/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience`, ...nextPages]
  return {
    pageUrls,
    currentPageIndex: workExperienceTypesToShowDetailsFormFor.indexOf(workExperienceType),
  }
}
