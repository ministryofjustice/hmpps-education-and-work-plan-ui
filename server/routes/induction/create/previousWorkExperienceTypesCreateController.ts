import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PageFlow } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import PreviousWorkExperienceTypesController from '../common/previousWorkExperienceTypesController'
import { buildNewPageFlowHistory, getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
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
    const pageFlowQueue = buildPageFlowQueue(updatedInduction, prisonNumber)
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
 * added to the queue is the list of work types on the updated induction.
 */
const buildPageFlowQueue = (updatedInduction: InductionDto, prisonNumber: string): PageFlow => {
  const workExperienceTypesOnUpdatedInduction = (updatedInduction.previousWorkExperiences.experiences || []).map(
    experience => experience.experienceType,
  )

  const workExperienceTypesToShowDetailsFormFor = [...workExperienceTypesOnUpdatedInduction].sort(
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
