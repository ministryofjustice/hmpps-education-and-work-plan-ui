import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InductionDto } from 'inductionDto'
import type { AdditionalTrainingForm } from 'inductionForms'
import type { PageFlow } from 'viewModels'
import AdditionalTrainingController from '../common/additionalTrainingController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateAdditionalTrainingForm from './additionalTrainingFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

/**
 * Controller for Updating a Prisoner's Additional Training or Vocational Qualifications screen of the Induction.
 */
export default class AdditionalTrainingUpdateController extends AdditionalTrainingController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/plan/${prisonNumber}/view/education-and-training`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitAdditionalTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.additionalTrainingForm = { ...req.body }
    if (!req.session.additionalTrainingForm.additionalTraining) {
      req.session.additionalTrainingForm.additionalTraining = []
    }
    if (!Array.isArray(req.session.additionalTrainingForm.additionalTraining)) {
      req.session.additionalTrainingForm.additionalTraining = [req.session.additionalTrainingForm.additionalTraining]
    }
    const { additionalTrainingForm } = req.session

    const errors = validateAdditionalTrainingForm(additionalTrainingForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/additional-training`)
    }

    const updatedInduction = this.updatedInductionDtoWithAdditionalTraining(inductionDto, additionalTrainingForm)

    if (req.session.updateInductionQuestionSet) {
      req.session.inductionDto = updatedInduction
      const { updateInductionQuestionSet } = req.session
      const nextPage =
        updateInductionQuestionSet.hopingToWorkOnRelease === 'YES'
          ? `/prisoners/${prisonNumber}/induction/has-worked-before`
          : `/prisoners/${prisonNumber}/induction/in-prison-work`
      req.session.pageFlowHistory = this.buildPageFlowHistory(prisonNumber)
      req.session.additionalTrainingForm = undefined
      return res.redirect(nextPage)
    }

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.additionalTrainingForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  private updatedInductionDtoWithAdditionalTraining(
    inductionDto: InductionDto,
    additionalTrainingForm: AdditionalTrainingForm,
  ): InductionDto {
    return {
      ...inductionDto,
      previousTraining: {
        ...inductionDto.previousTraining,
        trainingTypes: additionalTrainingForm.additionalTraining,
        trainingTypeOther: additionalTrainingForm.additionalTrainingOther,
      },
    }
  }

  buildPageFlowHistory = (prisonNumber: string): PageFlow => {
    return {
      pageUrls: [`/prisoners/${prisonNumber}/induction/additional-training`],
      currentPageIndex: 0,
    }
  }
}
