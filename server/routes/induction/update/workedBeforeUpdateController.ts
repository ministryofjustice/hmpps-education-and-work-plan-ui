import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { PageFlow } from 'viewModels'
import type { WorkedBeforeForm } from 'inductionForms'
import WorkedBeforeController from '../common/workedBeforeController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateWorkedBeforeForm from '../../validators/induction/workedBeforeFormValidator'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import { getPreviousPage } from '../../pageFlowHistory'
import { getNextPage } from '../../pageFlowQueue'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

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
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) || `/plan/${prisonNumber}/view/work-and-interests`
    return previousPage
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitWorkedBeforeForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    const workedBeforeForm: WorkedBeforeForm = { ...req.body }
    req.session.workedBeforeForm = workedBeforeForm

    const errors = validateWorkedBeforeForm(workedBeforeForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/has-worked-before`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithHasWorkedBefore(inductionDto, workedBeforeForm)

    // If the previous page was Check Your Answers, decide whether to redirect back check answers on submission
    if (this.previousPageWasCheckYourAnswers(req)) {
      req.session.inductionDto = updatedInduction
      // Not worked before is selected, redirect to Check Your Answers
      req.session.workedBeforeForm = undefined
      if (
        workedBeforeForm.hasWorkedBefore === HasWorkedBeforeValue.NO ||
        workedBeforeForm.hasWorkedBefore === HasWorkedBeforeValue.NOT_RELEVANT
      ) {
        return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      }
      // Prisoner has worked before, redirect through previous work experience flow
      const pageFlowQueue = this.buildPageFlowQueue(prisonNumber)
      req.session.pageFlowQueue = pageFlowQueue
      return res.redirect(getNextPage(pageFlowQueue))
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
