import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import QualificationsListController from '../common/qualificationsListController'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import { setCurrentPage, getPreviousPage, isPageInFlow, buildNewPageFlowHistory } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import EducationLevelValue from '../../../enums/educationLevelValue'

export default class QualificationsListUpdateController extends QualificationsListController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      // TODO - The intention here is to revert the position of the current page index to /qualifications or /want-to-add-qualifications (effectively so that /qualification-level and /qualification-detail are removed, if applicable)
      // However it's not simply a case of checking if the induction has qualifications (though that needs to be included in the logic, along with whether /want-to-add-qualifications is in the history (which won't be the case during the long route!))

      // Currently /want-to-add-qualifications is being left in the history when /qualifications should be. This manifests itself on the /additional-training page

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
        req.session.pageFlowHistory = buildNewPageFlowHistory(req)
      }
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualification-level`)
    }

    if (userClickedOnButton(req, 'removeQualification')) {
      const qualificationIndexToRemove = req.body.removeQualification as number
      req.session.inductionDto = inductionWithRemovedQualification(inductionDto, qualificationIndexToRemove)
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualifications`)
    }

    // If the previous page was Check Your Answers, forward to Check Your Answers again
    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
    }

    if (inductionHasNoQualifications(inductionDto)) {
      // If check-your-answers is in the page history but it's not the previous page, then the user has indicated they want to add qualifications from the Check Your Answers page
      if (this.checkYourAnswersIsInThePageHistory(req)) {
        // Skip the highest level of education as its not asked in this scenario, and go straight to asking about the qualifications
        return res.redirect(`/prisoners/${prisonNumber}/induction/qualification-level`)
      }

      logger.debug(
        `Induction has no qualifications. Redirect the user to Highest Level of Education in order to start adding qualification(s)`,
      )
      return res.redirect(`/prisoners/${prisonNumber}/induction/highest-level-of-education`)
    }

    const updatedInduction = updatedInductionDtoWithDefaultedHighestLevelOfEducation(inductionDto)
    req.session.inductionDto = updatedInduction

    // If check-your-answers is in the page history then we need to redirect back to there
    if (this.checkYourAnswersIsInThePageHistory(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
    }

    // if we are changing the main question set, then proceed to additional-training without calling the API
    if (req.session.updateInductionQuestionSet) {
      return res.redirect(`/prisoners/${prisonNumber}/induction/additional-training`)
    }

    // By submitting the form without adding/removing any other educational qualifications, the user is indicating their
    // updates to Educational Qualifications are complete.
    // Update the Induction and return to Education and Training
    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.highestLevelOfEducationForm = undefined
      req.session.qualificationLevelForm = undefined
      req.session.qualificationDetailsForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
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
      // If there are still qualifications then we can use the previous highest level of education; otherwise there are no qualifications so we cannot be sure of the highest level of education
      educationLevel:
        updatedQualifications.length > 0
          ? inductionDto.previousQualifications.educationLevel
          : EducationLevelValue.NOT_SURE,
    },
  }
}

const updatedInductionDtoWithDefaultedHighestLevelOfEducation = (inductionDto: InductionDto): InductionDto => {
  return {
    ...inductionDto,
    previousQualifications: {
      ...inductionDto.previousQualifications,
      educationLevel: inductionDto.previousQualifications.educationLevel || EducationLevelValue.NOT_SURE,
    },
  }
}
