import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import QualificationsListController from '../common/qualificationsListController'
import { buildNewPageFlowHistory, getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

export default class QualificationsListCreateController extends QualificationsListController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory, inductionDto } = req.session
    let previousPage = pageFlowHistory && getPreviousPage(pageFlowHistory)
    if (!previousPage) {
      // No previous page from the Page Flow History
      // The previous page in this case is based on whether the prisoner is hoping to work on release
      previousPage =
        inductionDto.workOnRelease.hopingToWork === HopingToGetWorkValue.YES
          ? `/prisoners/${prisonNumber}/create-induction/work-interest-roles`
          : `/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`
    }
    return previousPage
  }

  getBackLinkAriaText(req: Request, res: Response): string {
    return getDynamicBackLinkAriaText(req, res, this.getBackLinkUrl(req))
  }

  submitQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.session

    if (!req.session.pageFlowHistory) {
      req.session.pageFlowHistory = buildNewPageFlowHistory(req)
    }

    if (userClickedOnButton(req, 'addQualification')) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/qualification-level`)
    }

    if (userClickedOnButton(req, 'removeQualification')) {
      const qualificationIndexToRemove = req.body.removeQualification as number
      req.session.inductionDto = inductionWithRemovedQualification(inductionDto, qualificationIndexToRemove)
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/qualifications`)
    }

    if (this.previousPageWasCheckYourAnswers(req)) {
      req.session.pageFlowHistory = undefined
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    if (inductionHasQualifications(inductionDto)) {
      // Remove the page flow history as it was only needed here to track the journey through qualifications
      req.session.pageFlowHistory = undefined
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/additional-training`)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/highest-level-of-education`)
  }
}

const inductionHasQualifications = (inductionDto: InductionDto): boolean =>
  inductionDto.previousQualifications?.qualifications?.length > 0

const userClickedOnButton = (request: Request, buttonName: string): boolean =>
  Object.prototype.hasOwnProperty.call(request.body, buttonName)

const inductionWithRemovedQualification = (
  inductionDto: InductionDto,
  qualificationIndexToRemove: number,
): InductionDto => {
  const updatedQualifications = [...inductionDto.previousQualifications.qualifications]
  updatedQualifications.splice(qualificationIndexToRemove, 1)
  return {
    ...inductionDto,
    previousQualifications: {
      ...inductionDto.previousQualifications,
      qualifications: updatedQualifications,
    },
  }
}
