import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'
import { InductionService } from '../../../services'
import validateHighestLevelOfEducationForm from '../../validators/induction/highestLevelOfEducationFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { getPreviousPage } from '../../pageFlowHistory'
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
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/highest-level-of-education`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithHighestLevelOfEducation(
      inductionDto,
      highestLevelOfEducationForm,
    )
    req.session.inductionDto = updatedInduction
    req.session.highestLevelOfEducationForm = undefined

    // If the previous page was Check Your Answers, forward to Check Your Answers again
    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
    }

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
