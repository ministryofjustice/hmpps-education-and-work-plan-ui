import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { WorkedBeforeForm } from 'inductionForms'
import type { PageFlow } from 'viewModels'
import WorkedBeforeController from '../common/workedBeforeController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateWorkedBeforeForm from './workedBeforeFormValidator'
import YesNoValue from '../../../enums/yesNoValue'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import { buildNewPageFlowHistory, getPreviousPage } from '../../pageFlowHistory'
import { getNextPage } from '../../pageFlowQueue'

/**
 * Controller for the Update of the Worked Before screen of the Induction.
 */
export default class WorkedBeforeUpdateController extends WorkedBeforeController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitWorkedBeforeForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.workedBeforeForm = { ...req.body }
    if (!req.session.workedBeforeForm.hasWorkedBefore == null) {
      req.session.workedBeforeForm.hasWorkedBefore = true
    }
    const { workedBeforeForm } = req.session

    const errors = validateWorkedBeforeForm(workedBeforeForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/has-worked-before`)
    }

    const updatedInduction = this.updatedInductionDtoWithHasWorkedBefore(inductionDto, workedBeforeForm)

    // If the previous page was Check Your Answers, decide whether to redirect back check answers on submission
    if (this.previousPageWasCheckYourAnswers(req)) {
      req.session.inductionDto = updatedInduction
      // Not worked before is selected, redirect to Check Your Answers
      req.session.workedBeforeForm = undefined
      if (workedBeforeForm.hasWorkedBefore === YesNoValue.NO) {
        return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      }
      // Prisoner has worked before, redirect through previous work experience flow
      const pageFlowQueue = this.buildPageFlowQueue(prisonNumber)
      req.session.pageFlowQueue = pageFlowQueue
      return res.redirect(getNextPage(pageFlowQueue))
    }

    if (req.session.updateInductionQuestionSet) {
      req.session.inductionDto = updatedInduction
      const nextPage =
        workedBeforeForm.hasWorkedBefore === 'YES'
          ? `/prisoners/${prisonNumber}/induction/previous-work-experience`
          : `/prisoners/${prisonNumber}/induction/work-interest-types`
      req.session.pageFlowHistory = buildNewPageFlowHistory(req)
      req.session.workedBeforeForm = undefined
      return res.redirect(nextPage)
    }

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.workedBeforeForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  private updatedInductionDtoWithHasWorkedBefore(
    inductionDto: InductionDto,
    workedBeforeForm: WorkedBeforeForm,
  ): InductionDto {
    let previousExperience: Array<PreviousWorkExperienceDto> = []
    if (workedBeforeForm.hasWorkedBefore === YesNoValue.YES && inductionDto.previousWorkExperiences?.experiences) {
      previousExperience = [...inductionDto.previousWorkExperiences.experiences]
    }
    return {
      ...inductionDto,
      previousWorkExperiences: {
        ...inductionDto.previousWorkExperiences,
        experiences: previousExperience,
        hasWorkedBefore: workedBeforeForm.hasWorkedBefore === YesNoValue.YES,
      },
    }
  }

  private buildPageFlowQueue(prisonNumber: string): PageFlow {
    return {
      pageUrls: [
        `/prisoners/${prisonNumber}/induction/has-worked-before`,
        `/prisoners/${prisonNumber}/induction/previous-work-experience`,
        `/prisoners/${prisonNumber}/induction/check-your-answers`,
      ],
      currentPageIndex: 0,
    }
  }
}
