import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import type { PageFlow } from 'viewModels'
import HopingToWorkOnReleaseController from '../common/hopingToWorkOnReleaseController'
import validateHopingToWorkOnReleaseForm from './hopingToWorkOnReleaseFormValidator'
import { InductionService } from '../../../services'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'

export default class HopingToWorkOnReleaseUpdateController extends HopingToWorkOnReleaseController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(req: Request): string {
    const { prisonerSummary } = req.session
    return `Back to ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s learning and work progress`
  }

  submitHopingToWorkOnReleaseForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.hopingToWorkOnReleaseForm = { ...req.body }
    const { hopingToWorkOnReleaseForm } = req.session

    const errors = validateHopingToWorkOnReleaseForm(hopingToWorkOnReleaseForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
    }

    const updatedInduction = updatedInductionDtoWithHopingToWorkOnRelease(inductionDto, hopingToWorkOnReleaseForm)
    req.session.inductionDto = updatedInduction

    if (changeWillResultInANewQuestionSet(inductionDto, hopingToWorkOnReleaseForm)) {
      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: hopingToWorkOnReleaseForm.hopingToGetWork }
      const nextPage =
        hopingToWorkOnReleaseForm.hopingToGetWork === HopingToGetWorkValue.YES
          ? `/prisoners/${prisonNumber}/induction/qualifications`
          : `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`
      // start of the flow - always initialise the page history here
      const pageFlowHistory = this.buildPageFlowHistory(prisonNumber)
      req.session.pageFlowHistory = pageFlowHistory
      return res.redirect(nextPage)
    }

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }

    req.session.hopingToWorkOnReleaseForm = undefined
    req.session.inductionDto = undefined
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }

  buildPageFlowHistory = (prisonNumber: string): PageFlow => {
    return {
      pageUrls: [`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`],
      currentPageIndex: 0,
    }
  }
}

/**
 * Returns true if the new answer to "Hoping to work on release" will cause a new question set to be asked.
 * In the context of updating the Induction with the new answer to this question, it means we need to present the user
 * with other screens/questions to build up a valid Induction.
 * IE. we cannot simply update the Induction from "Hoping to work on release = NO" to "Hoping to work on release = YES"
 * because the resultant Induction will have missing data, as there are different questions asked based on whether the
 * prisoner is hoping to work on release or not.
 */
const changeWillResultInANewQuestionSet = (
  currentInductionDto: InductionDto,
  hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm,
): boolean => {
  const currentInductionValue = currentInductionDto.workOnRelease?.hopingToWork
  const proposedValue = hopingToWorkOnReleaseForm.hopingToGetWork

  return (
    (currentInductionValue === HopingToGetWorkValue.YES &&
      (proposedValue === HopingToGetWorkValue.NO || proposedValue === HopingToGetWorkValue.NOT_SURE)) ||
    ((currentInductionValue === HopingToGetWorkValue.NO || currentInductionValue === HopingToGetWorkValue.NOT_SURE) &&
      proposedValue === HopingToGetWorkValue.YES)
  )
}

const updatedInductionDtoWithHopingToWorkOnRelease = (
  inductionDto: InductionDto,
  hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm,
): InductionDto => {
  return {
    ...inductionDto,
    workOnRelease: {
      ...inductionDto.workOnRelease,
      hopingToWork: hopingToWorkOnReleaseForm.hopingToGetWork,
    },
  }
}
