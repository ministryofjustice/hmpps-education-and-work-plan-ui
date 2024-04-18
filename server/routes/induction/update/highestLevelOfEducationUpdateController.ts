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
import { buildNewPageFlowHistory, getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

/**
 * Controller for the Update of the Highest Level of Education screen of the Induction.
 */
export default class HighestLevelOfEducationUpdateController extends HighestLevelOfEducationController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/education-and-training`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
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

    const updatedInduction = updatedInductionDtoWithHighestLevelOfEducation(inductionDto, highestLevelOfEducationForm)
    req.session.inductionDto = updatedInduction
    req.session.highestLevelOfEducationForm = undefined

    // If the previous page was Check Your Answers, forward to Check Your Answers again
    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
    }

    if (
      // The Induction already has qualifications, regardless of the new Highest Level of Education
      inductionHasEducationQualifications(inductionDto) ||
      // Or if the new Highest Level of Education does not require qualifications, regardless of whether qualifications already exist on the induction
      highestLevelOfEducationDoesNotRequireQualifications(highestLevelOfEducationForm)
    ) {
      logger.debug(
        'Induction can be updated with new Highest Level of Education without asking further questions about educational qualifications',
      )

      try {
        const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
        await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)
        req.session.inductionDto = undefined
        return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
      } catch (e) {
        logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
        return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
      }
    } else {
      logger.debug('New Highest Level of Education requires asking further questions about educational qualifications')

      // if there is no page history (i.e. because we're not changing the main question set), start one here before commencing the add qualification mini flow
      if (!req.session.pageFlowHistory) {
        req.session.pageFlowHistory = buildNewPageFlowHistory(req)
      }
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualification-level`)
    }
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
