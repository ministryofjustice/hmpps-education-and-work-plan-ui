import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { HighestLevelOfEducationForm } from 'inductionForms'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'
import { InductionService } from '../../../services'
import validateHighestLevelOfEducationForm from './highestLevelOfEducationFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import EducationLevelValue from '../../../enums/educationLevelValue'
import logger from '../../../../logger'

/**
 * Controller for the Update of the Highest Level of Education screen of the Induction.
 */
export default class HighestLevelOfEducationUpdateController extends HighestLevelOfEducationController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/education-and-training`
  }

  getBackLinkAriaText(_req: Request): string {
    return 'Back to <TODO - check what CIAG UI does here>'
  }

  submitHighestLevelOfEducationForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.highestLevelOfEducationForm = { ...req.body }
    const { highestLevelOfEducationForm } = req.session

    const errors = validateHighestLevelOfEducationForm(highestLevelOfEducationForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/highest-level-of-education`)
    }

    if (changesToHighestLevelOfEducationSubmitted(inductionDto, highestLevelOfEducationForm)) {
      if (
        // The Induction already has qualifications, regardless of the new Highest Level of Education
        inductionHasEducationQualifications(inductionDto) ||
        // Or if the new Highest Level of Education does not require qualifications, regardless of whether qualifications already exist on the induction
        highestLevelOfEducationDoesNotRequireQualifications(highestLevelOfEducationForm)
      ) {
        // Update the Induction with the new Highest Level of Education
        const updatedInduction = updatedInductionDtoWithHighestLevelOfEducation(
          inductionDto,
          highestLevelOfEducationForm,
        )
        const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

        try {
          await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)
        } catch (e) {
          logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
          return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
        }
      }
    } else {
      logger.debug('No changes to Highest Level of Education were submitted')
    }

    req.session.highestLevelOfEducationForm = undefined
    req.session.inductionDto = undefined
    return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
  }
}

const highestLevelOfEducationDoesNotRequireQualifications = (
  highestLevelOfEducationForm: HighestLevelOfEducationForm,
): boolean => {
  const levelsOfEducationThatDoNotRequireQualifications = [
    EducationLevelValue.NOT_SURE,
    EducationLevelValue.PRIMARY_SCHOOL,
    EducationLevelValue.SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS,
  ]
  return levelsOfEducationThatDoNotRequireQualifications.includes(highestLevelOfEducationForm?.educationLevel)
}

const updatedInductionDtoWithHighestLevelOfEducation = (
  inductionDto: InductionDto,
  highestLevelOfEducationForm: HighestLevelOfEducationForm,
): InductionDto => {
  return {
    ...inductionDto,
    previousQualifications: {
      ...inductionDto.previousQualifications,
      educationLevel: highestLevelOfEducationForm.educationLevel,
    },
  }
}

/**
 * Return true if the given [InductionDto] contains one or more pre-prison educational qualifications
 */
const inductionHasEducationQualifications = (inductionDto: InductionDto): boolean =>
  inductionDto.previousQualifications?.qualifications?.length > 0

/**
 * Given the current Induction and the [HighestLevelOfEducationForm], returns `true` if there have been changes made
 * to the highest level of education.
 */
const changesToHighestLevelOfEducationSubmitted = (
  inductionDto: InductionDto,
  highestLevelOfEducationForm: HighestLevelOfEducationForm,
): boolean => highestLevelOfEducationForm.educationLevel !== inductionDto.previousQualifications.educationLevel
