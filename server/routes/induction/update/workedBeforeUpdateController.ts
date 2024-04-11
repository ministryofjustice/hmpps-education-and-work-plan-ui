import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InductionDto } from 'inductionDto'
import type { WorkedBeforeForm } from 'inductionForms'
import type { PageFlow } from 'viewModels'
import WorkedBeforeController from '../common/workedBeforeController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateWorkedBeforeForm from './workedBeforeFormValidator'
import YesNoValue from '../../../enums/yesNoValue'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import { getPreviousPage } from '../../pageFlowHistory'

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

    if (req.session.updateInductionQuestionSet) {
      req.session.inductionDto = updatedInduction
      const nextPage =
        workedBeforeForm.hasWorkedBefore === 'YES'
          ? `/prisoners/${prisonNumber}/induction/previous-work-experience`
          : `/prisoners/${prisonNumber}/induction/work-interest-types`
      req.session.pageFlowHistory = this.buildPageFlowHistory(prisonNumber)
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
    return {
      ...inductionDto,
      previousWorkExperiences: {
        ...inductionDto.previousWorkExperiences,
        hasWorkedBefore: workedBeforeForm.hasWorkedBefore === YesNoValue.YES,
      },
    }
  }

  private buildPageFlowHistory = (prisonNumber: string): PageFlow => {
    const pageUrls = [`/prisoners/${prisonNumber}/induction/has-worked-before`]
    return {
      pageUrls,
      currentPageIndex: 0,
    }
  }
}
