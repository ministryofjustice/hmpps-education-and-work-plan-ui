import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PageFlow } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import PreviousWorkExperienceTypesController from '../common/previousWorkExperienceTypesController'
import { buildNewPageFlowHistory, getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validatePreviousWorkExperienceTypesForm from '../../validators/induction/previousWorkExperienceTypesFormValidator'
import previousWorkExperienceTypeScreenOrderComparator from '../previousWorkExperienceTypeScreenOrderComparator'
import logger from '../../../../logger'
import { getNextPage } from '../../pageFlowQueue'
import { asArray } from '../../../utils/utils'

export default class PreviousWorkExperienceTypesCreateController extends PreviousWorkExperienceTypesController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/prisoners/${prisonNumber}/create-induction/has-worked-before`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitPreviousWorkExperienceTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    const previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm = {
      typeOfWorkExperience: asArray(req.body.typeOfWorkExperience),
      typeOfWorkExperienceOther: req.body.typeOfWorkExperienceOther,
    }
    req.session.previousWorkExperienceTypesForm = previousWorkExperienceTypesForm

    const errors = validatePreviousWorkExperienceTypesForm(previousWorkExperienceTypesForm, prisonerSummary)

    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/previous-work-experience`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithPreviousWorkExperiences(
      inductionDto,
      previousWorkExperienceTypesForm,
    )
    req.session.inductionDto = updatedInduction

    // We need to show the Details page for each work experience type.
    const pageFlowQueue = buildPageFlowQueue(inductionDto, updatedInduction, prisonNumber)
    req.session.pageFlowQueue = pageFlowQueue

    const userHasComeFromCheckYourAnswers = this.checkYourAnswersIsTheFirstPageInThePageHistory(req)
    if (!userHasComeFromCheckYourAnswers) {
      // For the normal Create journey we also need the page flow history so subsequent pages know where we have been and can display the correct back link
      // If we have come from Check Your Answers there will already be a correctly setup Page Flow History
      req.session.pageFlowHistory = buildNewPageFlowHistory(req)
    }
    req.session.previousWorkExperienceTypesForm = undefined

    return res.redirect(getNextPage(pageFlowQueue))
  }
}

/**
 * Builds and returns a Page Flow Queue to show the Details page for each work experience type. The list of pages to be
 * added to the queue is derived by the difference between the work types on the updated induction (ie. after the
 * induction has had the form values added) with the work types on the original (un-modified) induction.
 *   * For a new Induction in the Create journey this will result in all of the work types that were submitted on the form
 *   * For a new Induction that is being changed via the Change link on Check Your Answers this will result in just the
 *     additional work types that have been added (and therefore the user is not asked to provide the details for work
 *     types they have already added)
 */
const buildPageFlowQueue = (
  originalInduction: InductionDto,
  updatedInduction: InductionDto,
  prisonNumber: string,
): PageFlow => {
  const workExperienceTypesOnPreviousInduction = (originalInduction.previousWorkExperiences.experiences || []).map(
    experience => experience.experienceType,
  )
  const workExperienceTypesOnUpdatedInduction = (updatedInduction.previousWorkExperiences.experiences || []).map(
    experience => experience.experienceType,
  )
  const workExperienceDetailPagesToShow = workExperienceTypesOnUpdatedInduction.filter(
    type => !workExperienceTypesOnPreviousInduction.includes(type),
  )

  const workExperienceTypesToShowDetailsFormFor = [...workExperienceDetailPagesToShow].sort(
    previousWorkExperienceTypeScreenOrderComparator, // sort them by the order presented on screen (which is not alphabetic on the enum values)
  )
  logger.debug(
    `Previous Work Experiences resulting in going to the Detail pages for ${workExperienceTypesToShowDetailsFormFor}`,
  )

  const nextPages = workExperienceTypesToShowDetailsFormFor.map(
    workType => `/prisoners/${prisonNumber}/create-induction/previous-work-experience/${workType.toLowerCase()}`,
  )
  const pageUrls = [`/prisoners/${prisonNumber}/create-induction/previous-work-experience`, ...nextPages]
  return {
    pageUrls,
    currentPageIndex: 0,
  }
}
