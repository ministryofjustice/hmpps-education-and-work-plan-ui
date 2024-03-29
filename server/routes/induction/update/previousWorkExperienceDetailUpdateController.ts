import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { PreviousWorkExperienceDetailForm } from 'inductionForms'
import { InductionService } from '../../../services'
import PreviousWorkExperienceDetailController from '../common/previousWorkExperienceDetailController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import validatePreviousWorkExperienceDetailForm from './previousWorkExperienceDetailFormValidator'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import { getNextPage, isLastPage } from '../../pageFlowQueue'
import { getPreviousPage } from '../../pageFlowHistory'

/**
 * Controller for the Update of the Previous Work Experience Detail screen of the Induction.
 */

export default class PreviousWorkExperienceDetailUpdateController extends PreviousWorkExperienceDetailController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(req: Request): string {
    // TODO - retrieve text for previous work experience types (a generic one for all types?)
    const { prisonerSummary } = req.session
    return `Back to ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s learning and work progress`
  }

  submitPreviousWorkExperienceDetailForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary
    const { typeOfWorkExperience } = req.params

    let previousWorkExperienceType: TypeOfWorkExperienceValue
    try {
      previousWorkExperienceType = this.validateInductionContainsPreviousWorkExperienceOfType({
        req,
        inductionDto: inductionDto as InductionDto,
        invalidTypeOfWorkExperienceMessage: `Attempt to submit PreviousWorkExperienceDetailForm for invalid work experience type ${typeOfWorkExperience} from ${prisonerSummary.prisonNumber}'s Induction`,
        typeOfWorkExperienceMissingOnInductionMessage: `Attempt to submit PreviousWorkExperienceDetailForm for work experience type ${typeOfWorkExperience} that does not exist on ${prisonerSummary.prisonNumber}'s Induction`,
      })
    } catch (error) {
      return next(createError(404, `Previous Work Experience type ${typeOfWorkExperience} not found on Induction`))
    }

    req.session.previousWorkExperienceDetailForm = { ...req.body }
    const { previousWorkExperienceDetailForm } = req.session

    const errors = validatePreviousWorkExperienceDetailForm(previousWorkExperienceDetailForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/previous-work-experience/${typeOfWorkExperience}`)
    }

    const updatedInduction = this.updatedInductionDtoWithPreviousWorkExperienceDetail(
      inductionDto,
      previousWorkExperienceDetailForm,
      previousWorkExperienceType,
    )

    const { pageFlowQueue } = req.session
    if (pageFlowQueue && !isLastPage(pageFlowQueue)) {
      // There is a page flow queue, and we are not on the last page of the queue yet
      // Put the updated InductionDto on the session and redirect to the next page in the queue
      req.session.inductionDto = updatedInduction
      req.session.previousWorkExperienceDetailForm = undefined
      return res.redirect(getNextPage(pageFlowQueue))
    }

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.previousWorkExperienceDetailForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  private updatedInductionDtoWithPreviousWorkExperienceDetail(
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
