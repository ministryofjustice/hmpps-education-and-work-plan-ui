import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { PageFlow } from 'viewModels'
import QualificationsListController from '../common/qualificationsListController'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import { setCurrentPage, getPreviousPage, isPageInFlow } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

export default class QualificationsListUpdateController extends QualificationsListController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      // We cannot go back to /qualification-detail (if applicable), since the page forms have been removed from the session
      // To add further complexity, it's possible we haven't come to this page yet, since we may have gone to /want-to-add-qualifications
      // first (when switching from long route to short route and the prisoner does not have any recorded qualifications)
      const previousPage = isPageInFlow(pageFlowHistory, `/prisoners/${prisonNumber}/induction/qualifications`)
        ? `/prisoners/${prisonNumber}/induction/qualifications`
        : `/prisoners/${prisonNumber}/induction/want-to-add-qualifications`
      const revertedPageHistory = setCurrentPage(pageFlowHistory, previousPage)
      req.session.pageFlowHistory = revertedPageHistory
      return getPreviousPage(revertedPageHistory)
    }
    return `/plan/${prisonNumber}/view/education-and-training`
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
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    // Behaviour and subsequent routing of the submission of the Qualifications List page depends on whether the page
    // is submitted with the values `addQualification`, `removeQualification`; and if neither whether the Induction has
    // qualifications already on it or not.

    if (userClickedOnButton(req, 'addQualification')) {
      if (!req.session.pageFlowHistory) {
        const pageFlowHistory = this.buildPageFlowHistory(prisonNumber)
        req.session.pageFlowHistory = pageFlowHistory
      }
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualification-level`)
    }

    if (userClickedOnButton(req, 'removeQualification')) {
      const qualificationIndexToRemove = req.body.removeQualification as number
      req.session.inductionDto = inductionWithRemovedQualification(inductionDto, qualificationIndexToRemove)
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualifications`)
    }

    if (inductionHasNoQualifications(inductionDto)) {
      logger.debug(
        `Induction has no qualifications. Redirect the user to Highest Level of Education in order to start adding qualification(s)`,
      )
      return res.redirect(`/prisoners/${prisonNumber}/induction/highest-level-of-education`)
    }

    // if we are changing the main question set, then proceed to additional-training without calling the API
    if (req.session.updateInductionQuestionSet) {
      return res.redirect(`/prisoners/${prisonNumber}/induction/additional-training`)
    }

    // By submitting the form without adding/removing any other educational qualifications, the user is indicating their
    // updates to Educational Qualifications are complete.
    // Update the Induction and return to Education and Training
    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, inductionDto)

    try {
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      // TODO - reset all forms relating to education here, as the "journey" is complete
      req.session.highestLevelOfEducationForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  buildPageFlowHistory = (prisonNumber: string): PageFlow => {
    const pageUrls = [`/prisoners/${prisonNumber}/induction/qualifications`]
    return {
      pageUrls,
      currentPageIndex: 0,
    }
  }
}

const inductionHasNoQualifications = (inductionDto: InductionDto): boolean =>
  inductionDto.previousQualifications?.qualifications.length === 0

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
