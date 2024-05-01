import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import QualificationsListController from '../common/qualificationsListController'
import { buildNewPageFlowHistory, getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

export default class QualificationsListCreateController extends QualificationsListController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/prisoners/${prisonNumber}/create-induction/hoping-to-work-on-release`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
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

    const previousPageWasCheckYourAnswers = this.previousPageWasCheckYourAnswers(req)
    if (previousPageWasCheckYourAnswers) {
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
